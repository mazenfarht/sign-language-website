import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
    const {
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading
    } = useContext(AuthContext);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(e);
        } catch (error) {
            console.error("Registration failed:", error);
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
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Stack gap={3}>
                        <h2 style={{ marginLeft: "-140px", textAlign: "left", color: "white" }}>Register</h2>
                        <Form onSubmit={handleRegister}>
                            <input
                                type="text"
                                placeholder="Name"
                                style={{
                                    height: "50px",
                                    fontSize: "18px",
                                    marginBottom: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "10px",
                                    width: "180%",
                                    boxSizing: "border-box",
                                    marginLeft: "-140px"
                                }}
                                onChange={(e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                style={{
                                    height: "50px",
                                    fontSize: "18px",
                                    marginBottom: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "10px",
                                    width: "180%",
                                    boxSizing: "border-box",
                                    marginLeft: "-140px"
                                }}
                                onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                style={{
                                    height: "50px",
                                    fontSize: "18px",
                                    marginBottom: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "10px",
                                    width: "180%",
                                    boxSizing: "border-box",
                                    marginLeft: "-140px"
                                }}
                                onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })}
                            />
                            <Button
                                variant="primary"
                                type="submit"
                                style={{ marginLeft: "-140px", width: "180%", padding: "10px", fontSize: "18px" }}
                            >
                                {isRegisterLoading ? "Creating your account..." : "Register"}
                            </Button>
                            {registerError?.error && (
                                <Alert variant="danger" style={{ marginTop: "20px", borderRadius: "5px" }}>
                                    <p>{registerError?.message}</p>
                                </Alert>
                            )}
                        </Form>
                    </Stack>
                </Col>
            </Row>
        </div>
    );
}

export default Register;
