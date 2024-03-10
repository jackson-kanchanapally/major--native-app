import React from "react";
import { Box, Text, Flex, Button } from "native-base";

import { Image } from "react-native";
const myImageHeart = require("../assets/isn.png");
const myImageTemp = require("../assets/temp.png");
import { ref, onValue } from "firebase/database";
import { db } from "../firebaseConfig";
import QRCode from "react-native-qrcode-svg";

export default function MainUi() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const sref = ref(db, "DHT/");
    onValue(sref, (snapshot) => {
      const dat = snapshot.val();
      setData(dat);
    });
  }, []);
  return (
    <Flex h="100%" mt="50px" alignItems="center" pt="10">
      <Flex direction="row" justifyContent="center">
        <Box
          borderRadius="full"
          shadow={6}
          pt="20px"
          alignItems="center"
          mr="30px"
          h="150px"
          w="150px"
          bg="white"
        >
          <Image source={myImageHeart} style={{ width: 40, height: 40 }} />
          <Box
            pt="5px"
            _text={{
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            80
          </Box>
          <Text>bpm</Text>
        </Box>
        <Box
          borderRadius="full"
          shadow={6}
          justifyContent="center"
          alignItems="center"
          // mr="30px"
          h="150px"
          w="150px"
          bg="white"
          _text={{
            fontSize: "30px",
            fontWeight: "700",
          }}
        >
          <Image source={myImageTemp} style={{ width: 60, height: 60 }} />
          <Text
            fontSize="30px"
            fontWeight="700"
            color={data?.temperature >= 106 ? "red.600" : "black"}
          >
            {data && data.temperature}°F
          </Text>
        </Box>
      </Flex>
      <Flex direction="row" justifyContent="center">
        <Box
          borderRadius="2xl"
          shadow={6}
          justifyContent="center"
          alignItems="center"
          // mr="30px"
          h="150px"
          w="90%"
          mt="30px"
          bg="white"
          _text={{
            fontSize: "30px",
            fontWeight: "700",
          }}
        >
          {data && data.water == "1"
            ? "Safe from water"
            : "Might Fell in water"}
        </Box>
      </Flex>
      <Box mt="30px" mb="30px">
        <Button
          bg="gray.100"
          borderRadius="sm"
          size="sm"
          shadow={6}
          _text={{
            color: "black",
            fontSize: "16px",
          }}
        >
          Create QR
        </Button>
      </Box>
      <QRCode value="Mobile no: 984654211, address:9-113 jkg kjgjhg , pet name: snoopy" />
    </Flex>
  );
}
