"use client";
import React from "react";

function MainComponent() {
  const [playerPosition, setPlayerPosition] = useState(150);
  const [bullets, setBullets] = useState([]);
  const [aliens, setAliens] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const initialAliens = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 6; j++) {
        initialAliens.push({
          x: j * 50 + 50,
          y: i * 50 + 50,
          id: `alien-${i}-${j}`,
        });
      }
    }
    setAliens(initialAliens);

    const handleKeyPress = (e) => {
      if (gameOver) return;

      if (e.key === "ArrowLeft" && playerPosition > 0) {
        setPlayerPosition((prev) => prev - 10);
      }
      if (e.key === "ArrowRight" && playerPosition < 300) {
        setPlayerPosition((prev) => prev + 10);
      }
      if (e.key === " ") {
        setBullets((prev) => [...prev, { x: playerPosition + 15, y: 350 }]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPosition, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setBullets((prev) =>
        prev
          .map((bullet) => ({ ...bullet, y: bullet.y - 5 }))
          .filter((bullet) => bullet.y > 0)
      );

      setAliens((prev) => {
        const newAliens = prev.map((alien) => ({
          ...alien,
          y: alien.y + 0.2,
        }));

        if (newAliens.some((alien) => alien.y > 350)) {
          setGameOver(true);
        }

        return newAliens;
      });

      setBullets((prev) => {
        const remainingBullets = [...prev];
        setAliens((prevAliens) => {
          const remainingAliens = prevAliens.filter((alien) => {
            return !remainingBullets.some(
              (bullet) =>
                Math.abs(bullet.x - alien.x) < 20 &&
                Math.abs(bullet.y - alien.y) < 20
            );
          });

          if (remainingAliens.length < prevAliens.length) {
            setScore((s) => s + 100);
          }

          return remainingAliens;
        });
        return remainingBullets;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameOver]);

  return (
    <div className="relative w-[400px] h-[400px] bg-black mx-auto mt-8 overflow-hidden">
      {gameOver ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-press-start">
          <div className="text-2xl mb-4">GAME OVER</div>
          <div className="text-xl">Score: {score}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white text-black hover:bg-gray-200"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="absolute top-4 left-4 text-white font-press-start">
            Score: {score}
          </div>
          <div
            className="absolute w-[30px] h-[30px] bg-green-500"
            style={{ left: `${playerPosition}px`, bottom: "20px" }}
          />
          {bullets.map((bullet, i) => (
            <div
              key={i}
              className="absolute w-[4px] h-[10px] bg-white"
              style={{ left: `${bullet.x}px`, top: `${bullet.y}px` }}
            />
          ))}
          {aliens.map((alien) => (
            <div
              key={alien.id}
              className="absolute w-[30px] h-[30px] bg-red-500"
              style={{ left: `${alien.x}px`, top: `${alien.y}px` }}
            />
          ))}
        </>
      )}

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(5px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}

export default MainComponent;