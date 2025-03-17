"use client";
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { updateUserProfile } from "@/app/services/rest.service";
import {IUser} from "@/app/models/user.interface";

interface EditProfileModalProps {
  isVisible: boolean;
  onHide: () => void;
  user: Partial<IUser>;
  onProfileUpdated: () => void;
}

export default function EditProfileModal({ isVisible, onHide, user, onProfileUpdated }: EditProfileModalProps) {
  const [username, setUsername] = useState(user.username);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.profilePictureUrl || null);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<any>(null);
  
  const handleFileUpload = (event: any) => {
    const file = event.files ? event.files[0] : null;
    
    if (file) {
      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.id as string);
      formData.append("username", username as string);

      if (profileImage) {
        formData.append("profilePicture", profileImage);
      }
           
      const result = await updateUserProfile(user.id as string, formData);
      console.log("Profile update result:", result);
      
      toast.current?.show({ 
        severity: 'success', 
        summary: 'פרופיל עודכן', 
        detail: 'פרטי הפרופיל עודכנו בהצלחה', 
        life: 3000 
      });
      
      onProfileUpdated();
      
      // Close modal
      onHide();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'שגיאה', 
        detail: 'אירעה שגיאה בעדכון הפרופיל', 
        life: 3000 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Toast ref={toast} position="top-right" />
      <Dialog 
        header="עריכת פרופיל" 
        visible={isVisible} 
        onHide={onHide}
        style={{ width: '450px', direction: 'rtl' }}
        footer={
          <div className="flex justify-end gap-2">
            <Button 
              label="ביטול" 
              icon="pi pi-times" 
              onClick={onHide} 
              className="p-button-text" 
            />
            <Button 
              label="שמור" 
              icon="pi pi-check" 
              onClick={handleSubmit} 
              loading={loading} 
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <img 
                src={imagePreview || "https://tecdn.b-cdn.net/img/new/avatars/2.jpg"} 
                alt="תמונת פרופיל" 
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            {!user.isGoogleUser &&(
            <FileUpload
              ref={fileUploadRef}
              mode="basic"
              name="profilePicture"
              accept="image/*"
              maxFileSize={1000000}
              chooseLabel="שנה תמונה"
              className="mt-2"
              auto
              customUpload
              uploadHandler={(e) => {
                handleFileUpload(e);
                e.options.clear();
              }}
            />
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-medium">שם משתמש</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}