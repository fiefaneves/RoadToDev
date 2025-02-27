"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../Components/ui/button";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    interface FormData {
        email: string;
        password: string;
    }

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3005/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            });

            if (!response.ok) {
                throw new Error("Failed to login");
            }

            const result = await response.json();

            if (result.status === 200) {
                localStorage.setItem("user", JSON.stringify(result.data));
                router.push("/roadmap");
            } else{
                alert("Invalid email or password");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-cente">
            <div className="md:w-[20vw] bg-white mx-auto p-6 rounded-lg shadow-lg">
                <h1 className="flex justify-center text-black text-[50px]">Login</h1>
                <p className="flex justify-center text-black text-[11px] mb-8">
                    Welcome back! Please log in to continue.
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            {...register("email", { required: "Email is required" })}
                            type="email"
                            placeholder="Your email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            {...register("password", { required: "Password is required" })}
                            type="password"
                            placeholder="Your password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <Button type="submit" className="w-full bg-black text-white">
                            {loading ? "Loading..." : "Login"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;