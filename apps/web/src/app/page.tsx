"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@repo/ui/button";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";
const verifyEmailFormatRegex = new RegExp(
  /^(?:[a-zA-Z0-9_'^&+/=?`{|}~.-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
);

export default function Web() {
  const [email, setEmail] = useState<string>("");
  const [response, setResponse] = useState<{ message: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setResponse(null);
    setError(undefined);
  }, [email]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!verifyEmailFormatRegex.test(email)) {
      setError("Invalid email format");
      return;
    }
    try {
      const result = await fetch(`${API_HOST}/verify/${email}`);
      const response = await result.json();
      setResponse(response);
    } catch (err) {
      setError("Unable to fetch response");
    }
  };

  const onReset = () => {
    setEmail("");
  };

  return (
    <div>
      <h1>Verify Email</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Email </label>
        <input
          type="text"
          name="name"
          id="name"
          value={email}
          onChange={onChange}
        ></input>
        <Button type="submit">Submit</Button>
      </form>
      {error && (
        <div>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      {response && (
        <div>
          <h3>Verify result</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
          <Button onClick={onReset}>Reset</Button>
        </div>
      )}
    </div>
  );
}
