import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import {googleSignin} from "@/app/services/rest.service";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {saveUserToLocalStorage} from "@/app/services/local-storage.service";

export default function GoogleLoginButton() {
    const router: AppRouterInstance = useRouter();
    
    const googleResponseMessage = (credentialResponse: CredentialResponse) => {
        console.log("good");
        console.log(credentialResponse);
        googleSignin(credentialResponse).then((response) => {
            console.log(response);
            saveUserToLocalStorage({
                email: response.email,
                username: response.username,
                id: response._id,
                accessToken: response.accessToken});
            
            router.push('/');
            });
    }

    const googleErrorMessage = () => {
        console.log("error");
    }

    return (
        <GoogleLogin onSuccess={googleResponseMessage} onFailure={googleErrorMessage} />
        );
}