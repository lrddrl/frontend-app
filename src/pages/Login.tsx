import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginUser, setCredentials } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const passwordSchema = z.string().min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const { username: storedUsername, password: storedPassword } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [username, setUsername] = useState(storedUsername || '');
  const [password, setPassword] = useState(storedPassword || '');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (storedUsername && storedPassword) {
      dispatch(loginUser({ username: storedUsername, password: storedPassword })).then((result) => {
        if ((result as any).meta.requestStatus === 'fulfilled') {
          navigate('/invoices');
        }
      });
    }
  }, [dispatch, storedUsername, storedPassword, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      passwordSchema.parse(password);
      setErrors([]);
      dispatch(setCredentials({ username, password }));
      dispatch(loginUser({ username, password })).then((result) => {
        if ((result as any).meta.requestStatus === 'fulfilled') {
          navigate('/invoices');
        }
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.errors.map(error => error.message));
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={status === 'loading'}>Login</button>
        {status === 'failed' && <p>Error logging in</p>}
        {errors.length > 0 && (
          <div style={{ color: 'red' }}>
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
