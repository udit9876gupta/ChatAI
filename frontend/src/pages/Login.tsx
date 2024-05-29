import React,{ useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { IoLogIn } from "react-icons/io5";
import CustomizedInput from "../components/shared/CustomizedInput";
import { toast } from "react-hot-toast";
import { userAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const auth = userAuth();
    const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        try{
            toast.loading("Signing in...",{id:"login"});
            await auth?.login(email,password);
            toast.success("Signing in Successfully!",{id:"login"});
        }catch(error){
            toast.error("Signing in Failed!",{id:"login"});
        }
    }

    useEffect(() => {
        if(auth?.user){
            return navigate("/chat");
        }
    })
  return (
    <div>
      <Box width={"100%"} height={"100%"} display="flex" flex={1}>
        <Box
          padding={8}
          mt={8}
          display={{ md: "flex", sm: "none", xs: "none" }}
        >
          {/* <img src="" alt="robot" } /> */}
          <img src="pngegg.png" alt="robot" style={{ width: "400px" }} />
        </Box>
        <Box
          display={"flex"}
          flex={{ xs: 1, md: 0.5 }}
          justifyContent={"center"}
          padding={2}
          ml={"auto"}
          mt={16}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              margin: "auto",
              padding: "30px",
              boxShadow: "10px 10px 20px #000",
              borderRadius: "10px",
              border: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h4"
                textAlign={"center"}
                padding={2}
                fontWeight={600}
              >
                Login
              </Typography>
              <CustomizedInput type="email" label="Email" name="email" />
              <CustomizedInput
                type="password"
                label="Password"
                name="password"
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 2,
                  py: 1,
                  mt: 2,
                  width: "400px",
                  borderRadius: 2,
                  bgColor: "#00fffc",
                  ":hover": { bgcolor: "white", color: "black" },
                }}
                endIcon={<IoLogIn />}
              >
                Login
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default Login;
