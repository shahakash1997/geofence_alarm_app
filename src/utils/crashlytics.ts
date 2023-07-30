import crashlytics from '@react-native-firebase/crashlytics';

export function setUser(user: any) {
    crashlytics().log('User signed in.');
    Promise.all([
        crashlytics().setUserId('123'),
        crashlytics().setAttribute('credits', String('user.credits')),
        crashlytics().setAttributes({
            role: 'admin',
            followers: '13',
            email: user.email,
            username: user.username,
        }),
    ]).then().catch(err => {
        console.log(err);
    })
}
