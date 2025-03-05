import React, {
  useCallback,
  useContext,
  useState,
  useRef,
  useReducer, useEffect
} from "react";
import styles from "@/styles/saveForm.module.css";
import { GameContext } from "@/context/game-context";
import bcrypt from "bcryptjs";

interface NameInputProps {
}

const SaveForm: React.FC<NameInputProps> = (props) => {
  const { score, status, time } = useContext(GameContext);

  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const scoreRef = useRef(score);
  const statusRef = useRef(status);
  const timeRef = useRef(time);

  useEffect(() => {
    scoreRef.current = score;
    statusRef.current = status;
    timeRef.current = time;
  }, [score, status, time]);


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    const apiSalt = Number(process.env.NEXT_PUBLIC_API_SALT);
    const jsonString = JSON.stringify({
      name,
      score: scoreRef.current,
      status: statusRef.current,
      time: timeRef.current,
      apiSalt,
    });
    const generatedSalt = bcrypt.hashSync(jsonString, apiSalt);


    if (loading) return;

    if (!name.trim()) {
      setError("Provide your name pls");
      return;
    }

    if (scoreRef.current < 2) {
      setError("Try to play better");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/saveScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, score: scoreRef.current, status: statusRef.current, time: timeRef.current, generatedSalt }),
      });

      if (response.ok) {
        alert("Score saved successfully!");
        setName("");
      } else {
        throw new Error("Failed to save score");
      }
    } catch (error) {
      setError("Error saving score");
    } finally {
      setLoading(false);
    }
  }, [loading, name]);

  return (
    <div>
      <h3>Enter your name to save your score</h3>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Enter your name"
        className={styles.inputName}
        required={true}
      />
      <button
        onClick={handleSubmit}
        className={styles.button}
        disabled={loading}
      >
        {loading
          ? "Saving...":
           "Save score"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SaveForm;
