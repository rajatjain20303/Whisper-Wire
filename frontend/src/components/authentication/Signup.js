import React, { useState } from 'react'
import { Button, FormControl, FormLabel, VStack } from '@chakra-ui/react'
import { Input, InputGroup,InputRightElement } from '@chakra-ui/input'
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useHistory } from "react-router";
const Signup = () => {
    var [show,setshow]=useState(false)
    var [name,setName]=useState()
    var [email,setemail]=useState()
    var [password,setpassword]=useState()
    var [confirmpassword,setconfirmpassword]=useState()
    var [pic,setpic]=useState()
    const [picLoading, setPicLoading] = useState(false);
    var [show1,setshow1]=useState(false)
    var handleclick1=()=>setshow1(!show1)
    var handleclick=()=>setshow(!show)
    const toast = useToast();
    const history = useHistory();

    const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dp8if4cf1");
      fetch("https://api.cloudinary.com/v1_1/dp8if4cf1/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };
    const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
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
      setPicLoading(false);
    }
  };
  return (
    <VStack spacing='5px'color="black">
        <FormControl id='firstname' isRequired>
            <FormLabel>Name</FormLabel>
            <Input
                placeholder='Enter your name'
                onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input
                placeholder='Enter your Email'
                onChange={(e)=>setemail(e.target.value)}
            />
        </FormControl>
        <FormControl id='passord' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                    type={show?"text":"password"}
                    placeholder='Enter your Password'
                    onChange={(e)=>setpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button height="1.75rem" size="sm" onClick={handleclick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='confirmpassord' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input
                    type={show1?"text":"password"}
                    placeholder='Confirm password'
                    onChange={(e)=>setconfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button height="1.75rem" size="sm" onClick={handleclick1}>
                        {show1 ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic' isRequired>
            <FormLabel>Update Profile Picture</FormLabel>
            <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e)=>postDetails(e.target.files[0])}
            />
        </FormControl>
        <Button
        width="100%"
        padding="5px"
        colorScheme="blue"
        margin="5px"
        onClick={submitHandler}
        isLoading={picLoading}>Sign Up</Button>
    </VStack>
  )
  }

export default Signup
