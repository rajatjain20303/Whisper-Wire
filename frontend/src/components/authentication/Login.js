import React, { useState } from 'react'
import { Button, FormControl, FormLabel, VStack } from '@chakra-ui/react'
import { Input, InputGroup,InputRightElement } from '@chakra-ui/input'
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Login = () => {
  var [show,setshow]=useState(false)
    var [email,setemail]=useState()
    var [password,setpassword]=useState()
    var handleclick=()=>setshow(!show)
    const toast = useToast();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/user/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing='5px'color="black">
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input
                placeholder='Enter your Email'
                value={email}
                onChange={(e)=>setemail(e.target.value)}
            />
        </FormControl>
        <FormControl id='passord' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                    type={show?"text":"password"}
                    placeholder='Enter your Password'
                    value={password}
                    onChange={(e)=>setpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button height="1.75rem" size="sm" onClick={handleclick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button
        width="100%"
        padding="5px"
        colorScheme="blue"
        marginTop="5px"
        onClick={submitHandler}
        isLoading={loading}>Login</Button>
        <Button
        variant="solid"
        width="100%"
        padding="5px"
        colorScheme="red"
        marginTop="5px"
        onClick={()=>{
            setemail("guest@example.com")
            setpassword("123456")
        }}>Get Guest Login Credentials</Button>
    </VStack>
  )
}

export default Login
