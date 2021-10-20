import React, { useEffect, useState } from 'react';

import {
  Button,
  Text,
  TextInput,
  View,
} from 'react-native';
//import  from '@react-native-firebase/auth';
import auth,{firebase} from '@react-native-firebase/auth';
import { LoginManager, AccessToken,GraphRequest,GraphRequestManager } from 'react-native-fbsdk-next';


const App=()=>{
  const [fbAccessToken,setFbAccessToken]=useState("")
  const [email,setEmail]=useState()
  const [password,setPassword]=useState()
  const [userName,setUserName]=useState()
  useEffect(() => {
    //setUser(firebase.auth().currentUser)
      const unsubscribe =  firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // Signed in
            console.log(user.email)

            console.log("displayname after sign in",user.displayName)
           // console.log(user.phoneNumber)
if(user.displayName!==null)
            alert(user.displayName+" signed in")
            // user.providerData.forEach((profile) => {
            //   console.log("Sign-in provider: " + profile.providerId);
            //   console.log("  Provider-specific UID: " + profile.uid);
            //   console.log("  Name: " + profile.displayName);
            //   console.log("  Email: " + profile.email);});


          } else {
         //  await firebase.auth().signOut();
            // Signed out
            alert("signed out")
          }
        });
     
    
    
    
      
    }, []);
    
  //facebook sign in function
const facebookLogin=async()=>{
  console.log("fb login fn called")
// Attempt login with permissions
const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

if (result.isCancelled) {
  throw 'User cancelled the login process';
}

// Once signed in, get the users AccesToken
const data = await AccessToken.getCurrentAccessToken();
if (!data) {
  throw 'Something went wrong obtaining access token';
}
else{
  console.log("data======== ",data)
  //setting accesstoken
setFbAccessToken(data.accessToken)
// Create a Firebase credential with the AccessToken
const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
console.log("credential=====",facebookCredential)
// Sign-in the user with the credential
 await auth().signInWithCredential(facebookCredential);
 //auth().signInWithCredential(facebookCredential);
console.log("firebase sign in")
}//else 
}
//facebook sign out function
const facebookSignOut=async(fbAccessToken)=>{
  let logOut = new GraphRequest( "me/permissions/", {
     accessToken: fbAccessToken, httpMethod: 'DELETE' }, (error, result) => {
     console.log('LogOut Result---->>>', result); 
     if (error) { console.log('Error fetching data: ' + error.toString()); } 
     else { LoginManager.logOut(); } }); 
     new GraphRequestManager().addRequest(logOut).start();
     auth().signOut()
}
//signup with email and password
const emailSignUp=async()=>{
  try{
 //let usercredential=
 await auth()
  .createUserWithEmailAndPassword(email, password)
  .then((usercredential) => {
    console.log('User account created & signed in!');
    console.log(usercredential)
    usercredential.user.updateProfile({displayName:userName}).then(()=>{console.log("username updated")}).catch((e)=>console.log(e,"errorrrr"))
   usercredential.user.sendEmailVerification()
   alert("email verification link sent to your mail")
   //auth().signOut()
  })//then close
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
      alert("email already in use")
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    console.error(error);
  });

//   await usercredential.user.updateProfile({displayName:userName})
//  await usercredential.user.sendEmailVerification()
 await auth().signOut()
  // .catch(error => {
  //   if (error.code === 'auth/email-already-in-use') {
  //     console.log('That email address is already in use!');
  //     alert("email already in use")
  //   }

  //   if (error.code === 'auth/invalid-email') {
  //     console.log('That email address is invalid!');
  //   }

  //   console.error(error);
  // });
console.log(usercredential)

}//try end
catch{(error)=>{//console.log()
  if (error.code === 'auth/email-already-in-use') {
    console.log('That email address is already in use!');
    alert("email already in use")
  }

}}

}
//email sign out function
const emailSignout=async()=>{
  auth().signOut()
}
const emailSignIn=async()=>{
  await auth().signInWithEmailAndPassword(email,password)
  .then((usercredential) => {
    console.log("email verified===",usercredential.user.emailVerified)
    if(usercredential.user.emailVerified==false){
      alert("verify email to continue")
      auth().signOut();}
    else{console.log('User account signed in!');}
  })
  // .catch(error => {
  //   if (error.code === 'auth/email-already-in-use') {
  //     console.log('That email address is already in use!');
  //   }

  //   if (error.code === 'auth/invalid-email') {
  //     console.log('That email address is invalid!');
  //   }

  //   console.error(error);
  // });
  
}
const passwordReset=async(email)=>{
  if(email!==null)
  firebase.auth().sendPasswordResetEmail(email)
    .then(()=> {
        alert('Reset link has been sent to your  email...')
    }).catch((e)=> {
        console.log(e)
    })
    else{
      console.log("email is null")
      alert ("email cant be empty")
    }
}
  return(
    <View>
      <Text>sign in app</Text>
      <Button
      title="Facebook Sign-In"
      onPress={() => facebookLogin()}
    />
    <Button 
    title="fb logut"
    onPress={()=>{//LoginManager.logOut();auth().signOut().then((result)=>console.log(result))}
      facebookSignOut()
    }}/>
    <Text style={{backgroundColor:'#aaaaaa'}}>signUp with email and password</Text>
    <TextInput placeholder="enter user name" onChangeText={text=>setUserName(text)}/>
    <TextInput
    textContentType="emailAddress"
    placeholder="enter email"
    onChangeText={text=>{setEmail(text);console.log("email enterd===",email)}}
    />
     <TextInput
    textContentType='password'
    placeholder="password"
    secureTextEntry={true}
    onChangeText={text=>setPassword(text)}
    />
   <Button
      title="Sign-Up"
      onPress={() => emailSignUp()}
    />
    <Button
      title="Sign-Out"
      onPress={() => emailSignout()}
    />
    <Text>already an user sign in</Text>
    <Button 
    title="sign in"
    onPress={()=>{//LoginManager.logOut();auth().signOut().then((result)=>console.log(result))}
      emailSignIn()
    }}/>
    <Button
    title="reset email password"
    onPress={()=>passwordReset(email)}
    />
    </View>
  )
  }
export default App;
