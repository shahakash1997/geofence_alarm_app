import storage, {FirebaseStorageTypes} from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

export const apkStoreRef = storage().ref('application');

export function listFilesAndDirectories(reference: FirebaseStorageTypes.Reference, pageToken?: any): any {
    return reference.list({pageToken}).then(result => {
        // Loop over each item
        result.items.forEach(ref => {
            console.log(ref.fullPath);
        });

        if (result.nextPageToken) {
            return listFilesAndDirectories(reference, result.nextPageToken);
        }

        return Promise.resolve();
    });
}

export async function firebaseSignIn() {
    auth()
        .signInAnonymously()
        .then((creds) => {
            console.log(creds)
            console.log('User signed in anonymously');
        })
        .catch(error => {
            if (error.code === 'auth/operation-not-allowed') {
                console.log('Enable anonymous in your firebase console.');
            }

            console.error(error);
        });


}

export async function firebaseSignOut(){
    return auth().signOut()
}