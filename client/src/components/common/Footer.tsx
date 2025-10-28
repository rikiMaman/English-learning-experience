"use client";


import { FaGamepad, FaGithub } from "react-icons/fa";

export default function Footer() {
  const developers = [
    { name: "Shira Lazarovich", url: "/games/sentence-shuffle" },
    { name: "Michal Segal", url: "/games/picpick" },
    { name: "Shifra Strul", url: "/games/grammer-guru" },
    { name: "Tamar Vurzel", url: "/games/opposite-quest" },
    { name: "Sara Kahana", url: "/games/twin-words" },
    { name: "Hadar Gerashi", url: "/games/mini-wordle" },
    { name: "Dvora Etinger", url: "/games/memory-match-synonyms" },
    { name: "Rivki Merchavi", url: "/games/memory-match-antonyms" },
    { name: "Shani Gavra", url: "/games/reveal-it" },
    { name: "Yaffa Wertaimer", url: "/games/word-sorter" },
    { name: "Avital Goldring", url: "/games/letter-chaos" },
    { name: "Abigail Berk", url: "/games/guessmaster-20" },
    { name: "Shira Shtiglitz", url: "/games/double-vision" },
    { name: "Riki Maman", url: "/games/rhyme-time" },
    { name: "Yael Bloch", url: "/games/context-clues" },
    { name: "Miryam Rosenberg", url: "/games/phrase-craze" },
  ];

  return (
    <footer className="footer">
      <div className="footer__container">
        <h2 className="footer__title">
          Project Developers
          <a
            href="https://github.com/Fullstack-Common-Project/English-learning-experience"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            <FaGithub />
          </a>
        </h2>

        <div className="footer__developers">
          {developers.map((dev) => (
            <a
              key={dev.name}
              href={dev.url}
              className="text-sm hover:text-white transition"
            >
              {dev.name}
            </a>
          ))}
        </div>
        <footer className="mt-16 text-gray-500 text-sm text-center">
          © 2025 English Learning Platform | Built with ❤️ by Team Experis
        </footer>
      </div>
    </footer>
  );
}
