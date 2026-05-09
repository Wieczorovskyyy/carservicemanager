-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Maj 08, 2026 at 07:30 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `car_service_manager`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `car_model` varchar(120) NOT NULL,
  `mileage` int(10) unsigned DEFAULT NULL,
  `service_type` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `status` enum('new','accepted','in_progress','done','error','rejected','cancelled','change_requested') NOT NULL DEFAULT 'new',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `car_model`, `service_type`, `description`, `appointment_date`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(6, 7, 'Audi A4 B6', 'Wymiana oleju i filtrów', 'ADWADAWDAWDWAWA', '2026-04-28 08:00:00', 'cancelled', 'gsehgwhbwhwhwr', '2026-04-27 02:06:29', '2026-05-06 12:54:25'),
(7, 5, 'hh adawdwa', 'Przegląd okresowy', 'wadwadwdwaw', '2026-04-29 13:00:00', 'done', NULL, '2026-04-27 10:41:02', '2026-04-27 10:42:08'),
(8, 5, 'AUDI A4 B6', 'Inna naprawa', 'STUKI W SILNIKU', '2026-05-08 14:46:00', 'error', 'jfghvajhkgvhjksahbvklwsajbvws', '2026-05-06 12:29:50', '2026-05-06 16:05:34');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','mechanic') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `phone` varchar(9) NOT NULL DEFAULT '000000000'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `first_name`, `last_name`, `phone`) VALUES
(5, 'admin', 'admin@admin.com', '$2b$10$HG9c8LLLLv5YLMVg9FRK5eGDjHnNHw.aQyZ9n.yNslQJQgRp65Ow6', 'admin', '2026-04-26 23:22:54', 'Test', 'Tester', '000000000'),
(6, 'mechanic', 'mechanic@mechanic.com', '$2b$10$VWAaqddpi2NOqE.BjXCwseYRsbmciU5Hs/cfxDyaUTRbIQOJeW6Y6', 'mechanic', '2026-04-26 23:23:08', 'A', 'A', '000000000'),
(7, 'user', 'user@user.com', '$2b$10$jK306ssZVTIFxZc56mIjM.0RyGYq69OsB0/GQfuc/.1oWYXXlU6Wy', 'user', '2026-04-26 23:23:23', 'B', 'B', '000000000');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_appointments_user` (`user_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `fk_appointments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
