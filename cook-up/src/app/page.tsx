'use client'

import React, { useEffect, useState, useRef } from 'react';
import { IRecipe } from "@server/interfaces/recipe.interface";
import { ProgressSpinner } from "primereact/progressspinner";
import RecipePost from "@/app/components/posts";
import { getUserByID } from "@/app/services/users-service";
import { IUser } from "@/app/models/user.interface";
import {getRecipes, refreshToken} from "@/app/services/rest.service";
import { Button } from "primereact/button";
import _ from "lodash";
import {
  getUserFromLocalStorage, LocalStorageUser,
  removeUserFromLocalStorage,
  setTokensToLocalStorage
} from "@/app/services/local-storage.service";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useRouter} from "next/navigation";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreRecipes();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [hasMore, loadingMore, loading]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshAccessToken, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const refreshAccessToken = () => {
    const userLoggedIn: LocalStorageUser = getUserFromLocalStorage();
    if (userLoggedIn) {
      refreshToken(userLoggedIn.id, userLoggedIn.refreshToken as string)
          .then(res => {
            setTokensToLocalStorage(res);
          })
          .catch(err => {
            console.log('Refresh failed', err);

            const router: AppRouterInstance = useRouter();
            removeUserFromLocalStorage();
            router.push('/login');
          });
    }
  }

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const recipesResponse = await getRecipes(1, 10);
      const usersRecipes = recipesResponse.recipes;
      setPagination(recipesResponse.pagination);
      
      const feedRecipes: IRecipe[] = _.shuffle(usersRecipes);

      setRecipes(feedRecipes);

      setHasMore(recipesResponse.pagination.page < recipesResponse.pagination.totalPages);
      
      await fetchUsersForRecipes(feedRecipes);
    } catch (error) {
      console.error("Error fetching initial recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersForRecipes = async (recipesToFetch: IRecipe[]) => {
    try {
      const senderIds: string[] = Array.from(new Set(recipesToFetch.map((recipe: IRecipe) => recipe.senderId)))
      const usersData: IUser[] = await Promise.all(senderIds.map(async (senderId: string) => {
          return await getUserByID(senderId);
        })
      );
      setUsers(prevUsers => {
        const existingUserIds = new Set(prevUsers.map(user => user.id));
        const newUsers = usersData.filter(user => !existingUserIds.has(user.id));
        return [...prevUsers, ...newUsers];
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const loadMoreRecipes = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      
      const recipesResponse = await getRecipes(nextPage, pagination.limit);
      const newRecipes = recipesResponse.recipes;

      setPagination(recipesResponse.pagination);
      setHasMore(nextPage < recipesResponse.pagination.totalPages);
      setCurrentPage(nextPage);
      
      setRecipes(recipes.concat(newRecipes));
      
      await fetchUsersForRecipes(newRecipes);
    } catch (error) {
      console.error("Error loading more recipes:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center m-10">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 m-5">
      {recipes.length > 0 ? (
        <>
          {recipes.map((recipe: IRecipe) => (
            <RecipePost
              key={`${recipe.id}`}
              postProps={{
                recipe, 
                user: users.find((user: IUser) => user.id === recipe.senderId),
                onUpdate: fetchInitialData
              }}
            />
          ))}
          
          <div 
            ref={loaderRef} 
            className="w-full h-10"
            style={{ visibility: 'hidden' }}
          />
          
          {hasMore && (
            <Button 
              label={loadingMore ? "טוען..." : "טען עוד מתכונים"} 
              onClick={loadMoreRecipes}
              disabled={loadingMore}
              className="p-button-rounded p-button-primary mt-4 mb-6 px-4 py-2"
              style={{ minWidth: '200px', fontSize: '1.1rem' }}
            />
          )}
          
          {loadingMore && (
            <ProgressSpinner style={{ width: '40px', height: '40px' }} />
          )}
        </>
      ) : (
        <div className="text-center p-5">לא נמצאו מתכונים</div>
      )}
    </div>
  );
}