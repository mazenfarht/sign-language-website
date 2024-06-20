import { useContext } from "react";
import { Alert, Button, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const {
        loginUser,
        loginError,
        loginInfo,
        isLoginLoading,
        updateLoginInfo,
    } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(e);
            if (response.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "70px" // Adjust this value if the navbar height changes
            }}
        >
            <Row style={{ justifyContent: "center", width: "100%" }}>
                <Col xs={6}>
                    <Stack gap={3}>
                        <h2 style={{ textAlign: "left", color: "white" }}>Login</h2>
                        <input
                            type="email"
                            placeholder="Email"
                            style={{
                                height: "45px",
                                fontSize: "16px",
                                marginBottom: "15px",
                                borderRadius: "5px",
                                border: "1px solid #ced4da",
                                padding: "10px",
                                width: "100%",
                                boxSizing: "border-box"
                            }}
                            onChange={(e) => updateLoginInfo({ ...loginInfo, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={{
                                height: "45px",
                                fontSize: "16px",
                                marginBottom: "15px",
                                borderRadius: "5px",
                                border: "1px solid #ced4da",
                                padding: "10px",
                                width: "100%",
                                boxSizing: "border-box"
                            }}
                            onChange={(e) => updateLoginInfo({ ...loginInfo, password: e.target.value })}
                        />
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={handleLogin}
                            style={{ width: "100%", padding: "10px", fontSize: "18px" }}
                        >
                            {isLoginLoading ? "Getting you in..." : "Login"}
                        </Button>
                        {loginError?.error && (
                            <Alert variant="danger" style={{ marginTop: "20px", borderRadius: "5px" }}>
                                <p>{loginError?.message}</p>
                            </Alert>
                        )}
                    </Stack>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
