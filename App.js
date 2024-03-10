// import { NativeBaseProvider, Box, Flex } from "native-base";
// import React from "react";
// import { Platform } from "react-native";
// import MainUi from "./components/MainUi";
// import { Button, Text, View } from "react-native";
// import { useState, useEffect } from "react";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { ref, onValue } from "firebase/database";
// import { db } from "./firebaseConfig";
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState("");
//   const [data, setData] = React.useState([]);
//   useEffect(() => {
//     const sref = ref(db, "DHT/");
//     onValue(sref, (snapshot) => {
//       const dat = snapshot.val();
//       setData(dat);

//       if (dat && dat.water === "0") {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//           sendNotification(
//             "Check your pet!!!",
//             "Your pet might fell in water!"
//           );
//         }, 2 * 60 * 1000);
//       } else {
//         clearTimeout(timer);
//       }
//       if (dat && dat.temperature >= "104") {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//           sendNotification(
//             "Your pet's Temperature is High!!!",
//             "Your pet might fall  ill!"
//           );
//         }, 2 * 60 * 1000);
//       } else {
//         clearTimeout(timer);
//       }
//     });
//   }, []);
//   useEffect(() => {
//     console.log("Registering for push notifications...");
//     registerForPushNotificationsAsync()
//       .then((token) => {
//         console.log("token: ", token);
//         setExpoPushToken(token);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   async function registerForPushNotificationsAsync() {
//     let token;

//     if (Platform.OS === "android") {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#FF231F7C",
//       });
//     }

//     if (Device.isDevice) {
//       const { status: existingStatus } =
//         await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;
//       if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }
//       if (finalStatus !== "granted") {
//         alert("Failed to get push token for push notification!");
//         return;
//       }
//       // Learn more about projectId:
//       // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//       token = (
//         await Notifications.getExpoPushTokenAsync({
//           projectId: "dc99060f-087a-4cae-a73e-f7db7de5ca41",
//         })
//       ).data;
//       console.log(token);
//     } else {
//       alert("Must use physical device for Push Notifications");
//     }

//     return token;
//   }

//   const sendNotification = async (title, body) => {
//     console.log("Sending push notification...");

//     // notification message
//     const message = {
//       to: expoPushToken,
//       sound: "default",
//       title: title,
//       body: body,
//     };

//     await fetch("https://exp.host/--/api/v2/push/send", {
//       method: "POST",
//       headers: {
//         host: "exp.host",
//         accept: "application/json",
//         "accept-encoding": "gzip, deflate",
//         "content-type": "application/json",
//       },
//       body: JSON.stringify(message),
//     });
//     console.log("senttt");
//   };

//   return (
//     <NativeBaseProvider>
//       <MainUi />
//     </NativeBaseProvider>
//   );
// }
import { NativeBaseProvider } from "native-base";
import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import MainUi from "./components/MainUi";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { ref, onValue } from "firebase/database";
import { db } from "./firebaseConfig";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    let timer; // Declare timer variable

    const sref = ref(db, "DHT/");
    onValue(sref, (snapshot) => {
      const dat = snapshot.val();
      setData(dat);

      // Check water condition
      if (dat && dat.water === "0") {
        timer = setTimeout(() => {
        sendNotification("Check your pet!!!", "Your pet might fall in water!");
      }, 5*1000); 
      } else {
        clearTimeout(timer);
      }

      // Check temperature condition
      if (dat && parseInt(dat.temperature) >= 104) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          sendNotification(
            "Your pet's Temperature is High!!!",
            "Your pet might fall ill!"
          );
        }, 2 * 60 * 1000); // 2 minutes
      } else {
        clearTimeout(timer);
      }
    });

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  useEffect(() => {
    console.log("Registering for push notifications...");
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("token: ", token);
        setExpoPushToken(token);
      })
      .catch((err) => console.log(err));
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "dc99060f-087a-4cae-a73e-f7db7de5ca41",
        })
      ).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const sendNotification = async (title, body) => {
    console.log("Sending push notification...");

    // notification message
    const message = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify(message),
    });
    console.log("senttt");
  };

  return (
    <NativeBaseProvider>
      <MainUi />
    </NativeBaseProvider>
  );
}
