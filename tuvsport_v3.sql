-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 10, 2025 at 03:42 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tuvsport_v3`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `Activity_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Activity_Type` varchar(50) NOT NULL,
  `Activity_Description` text DEFAULT NULL,
  `Related_ID` int(11) DEFAULT NULL,
  `IP_Address` varchar(45) DEFAULT NULL,
  `User_Agent` varchar(255) DEFAULT NULL,
  `Created_At` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`Activity_ID`, `User_ID`, `Activity_Type`, `Activity_Description`, `Related_ID`, `IP_Address`, `User_Agent`, `Created_At`) VALUES
(1, 1, 'USER_DELETE', 'Deleted user with ID 47', 47, '::1', 'PostmanRuntime/7.44.1', '2025-07-08 19:10:57'),
(2, 1, 'PRODUCT_UPDATE', 'Deleted user with ID 1', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '2025-07-08 21:01:09'),
(3, 1, 'PRODUCT_UPDATE', 'Updated user with ID 1', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '2025-07-08 21:02:23'),
(4, 1, 'PRODUCT_UPDATE', 'Updated user with ID 1', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '2025-07-08 21:02:28'),
(5, 1, 'PRODUCT_UPDATE', 'Updated user with ID 1', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '2025-07-08 21:02:34'),
(6, 1, 'PRODUCT_UPDATE', 'Updated user with ID 1', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '2025-07-08 21:02:39'),
(7, 1, 'PRODUCT_VIEW', 'view on admin page user with ID 1', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '2025-07-08 21:23:34'),
(8, 1, 'PRODUCT_VIEW', 'view on admin page user with ID 1', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '2025-07-08 21:23:34'),
(9, 1, 'PRODUCT_DELETE', 'deleted by user with ID 1', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '2025-07-08 21:27:15');

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `Address_ID` int(11) NOT NULL,
  `AID` varchar(255) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Village` varchar(100) DEFAULT NULL,
  `District` varchar(100) DEFAULT NULL,
  `Province` varchar(100) DEFAULT NULL,
  `Transportation` varchar(255) NOT NULL,
  `Branch` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`Address_ID`, `AID`, `User_ID`, `Village`, `District`, `Province`, `Transportation`, `Branch`) VALUES
(5, '', 1, 'dongdok', 'xay', 'nv', 'anusith', 'talate khet'),
(6, '', 45, 'hehe', 'xay', 'nv', 'anusith', 'talate khet'),
(10, 'AID0ae24bee02', 1, 'dongdok', 'xay', 'nv', 'anusith', 'talate khet');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `Cart_ID` int(11) NOT NULL,
  `CID` varchar(20) NOT NULL,
  `Order_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Size` int(11) NOT NULL,
  `Color` varchar(255) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `Unit_Price` decimal(10,2) NOT NULL,
  `Subtotal` decimal(10,2) NOT NULL,
  `Added_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`Cart_ID`, `CID`, `Order_ID`, `User_ID`, `Product_ID`, `Size`, `Color`, `Quantity`, `Unit_Price`, `Subtotal`, `Added_at`) VALUES
(151, 'CID74158784dcf24a3', 105, 1, 10, 42, 'red', 1, 50000.00, 50000.00, '2025-06-15 18:34:07'),
(152, 'CIDc7436fd5e268424', 106, 1, 10, 42, 'red', 1, 50000.00, 50000.00, '2025-06-15 18:36:16'),
(153, 'CIDc538e5a419f04cc', 107, 1, 10, 42, 'red', 1, 50000.00, 50000.00, '2025-06-15 18:37:15'),
(154, 'CIDec30a10b8ba447a', 108, 1, 10, 42, 'red', 1, 50000.00, 50000.00, '2025-06-15 18:38:51'),
(155, 'CIDcc544f18ee79450', 109, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-15 18:39:43'),
(156, 'CIDedab79ffee4c43a', 110, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-15 18:44:21'),
(157, 'CID3d1743ac61ed4ac', 111, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-15 18:45:42'),
(159, 'CID409363c24a904f6', 113, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-17 15:24:54'),
(161, 'CID50b77dbaa8f74bf', 115, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-17 15:33:31'),
(162, 'CIDbb41b76acde640a', 116, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-17 15:34:50'),
(163, 'CID2853877770b64f8', 117, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-17 15:39:56'),
(164, 'CID64f6978126f3473', 118, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-17 15:40:34'),
(165, 'CID28445d0707a04cc', 119, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-17 15:41:05'),
(166, 'CID2651a06a899e4d5', 120, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-17 15:42:05'),
(167, 'CID47815908d95f4fc', 121, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-06-17 15:43:09'),
(171, 'CID8792229f309d457', 125, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-07-03 10:02:20'),
(172, 'CID77e1996e4f8f448', 126, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-07-03 10:02:21'),
(173, 'CIDd8dcd4f792da455', 127, 1, 10, 42, 'red', 1, 55000.00, 55000.00, '2025-07-03 10:02:30');

-- --------------------------------------------------------

--
-- Table structure for table `discount_codes`
--

CREATE TABLE `discount_codes` (
  `Id` int(11) NOT NULL,
  `Code` varchar(50) NOT NULL,
  `Type` enum('percentage','fixed') NOT NULL,
  `Value` decimal(10,2) NOT NULL,
  `Expires_At` datetime NOT NULL,
  `Usage_Limit` int(11) DEFAULT NULL,
  `Used_Count` int(11) NOT NULL DEFAULT 0,
  `Active` tinyint(1) NOT NULL DEFAULT 1,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `Inventory_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Size` varchar(20) DEFAULT NULL,
  `Color` varchar(30) DEFAULT NULL,
  `Quantity` int(11) NOT NULL
) ;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`Inventory_ID`, `Product_ID`, `Size`, `Color`, `Quantity`) VALUES
(1, 10, '42', 'red', 962),
(2, 8, '35', 'green', 9),
(3, 12, '42', 'purple', 10),
(4, 9, '43', 'red', 999),
(6, 11, '43', 'red', 10);

-- --------------------------------------------------------

--
-- Table structure for table `monthly_targets`
--

CREATE TABLE `monthly_targets` (
  `Target_ID` int(11) NOT NULL,
  `Target_Month` int(2) NOT NULL,
  `Target_Year` int(4) NOT NULL,
  `Target_Amount` decimal(10,2) NOT NULL,
  `Actual_Amount` decimal(10,2) DEFAULT 0.00,
  `Created_At` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `monthly_targets`
--

INSERT INTO `monthly_targets` (`Target_ID`, `Target_Month`, `Target_Year`, `Target_Amount`, `Actual_Amount`, `Created_At`) VALUES
(1, 6, 2025, 20000000.00, 1010000.00, '2025-06-15 16:12:58'),
(2, 1, 2025, 10000000.00, 215000.00, '2025-01-15 00:55:18'),
(3, 7, 2025, 10000000.00, 165000.00, '2025-07-02 22:44:20');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Order_ID` int(11) NOT NULL,
  `OID` varchar(255) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Address_ID` int(11) NOT NULL,
  `Shipment_ID` int(11) DEFAULT NULL,
  `Order_Date` datetime DEFAULT current_timestamp(),
  `Order_Status` varchar(20) NOT NULL DEFAULT 'pending',
  `Total_Amount` decimal(10,2) NOT NULL,
  `Discount_Code_Id` int(11) DEFAULT NULL,
  `session_id` varchar(255) NOT NULL DEFAULT 'ປາຍທາງ',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Order_ID`, `OID`, `User_ID`, `Address_ID`, `Shipment_ID`, `Order_Date`, `Order_Status`, `Total_Amount`, `Discount_Code_Id`, `session_id`, `created_at`, `updated_at`) VALUES
(105, 'OIDcc8af2121e', 1, 5, 108, '2025-06-15 18:34:07', 'completed', 50000.00, NULL, 'cs_test_b1edcIqJC1HZVeJdK8bLLrRzfUddgoRMIMpYXYoGMhHdleDCMbgGcxgf4w', '2025-06-15 11:34:07', '2025-06-15 11:34:18'),
(106, 'OID210a4c05ef', 1, 5, 109, '2025-06-15 18:36:15', 'completed', 50000.00, NULL, 'cs_test_b1aX25LePJDJV9iGafSk5XCDeYaHBDQo31GK5l6t4jG7zfoOuZU0j9nc9J', '2025-06-15 11:36:16', '2025-06-15 11:36:29'),
(107, 'OID8f5166d268', 1, 5, 110, '2025-06-15 18:37:14', 'pending', 50000.00, NULL, 'cs_test_b1OfaRKLoht3zqpKNef4SvsMg9HLkmRLGjTEmoKDTzEm8prOgqPypwJWOU', '2025-06-15 11:37:15', '2025-06-15 11:37:15'),
(108, 'OID9ee7ec0dde', 1, 5, 111, '2025-06-15 18:38:50', 'pending', 50000.00, NULL, 'cs_test_b1FMm23UezOP6UhKhfMXk9R6oVFqQHEVHF4MZPgMhaFoqUZUvuYv43OUR9', '2025-06-15 11:38:51', '2025-06-15 11:38:51'),
(109, 'OIDe0c46d82d7', 1, 5, 112, '2025-06-15 18:39:42', 'pending', 55000.00, NULL, 'cs_test_b1ZfiZQ0LUItnV0huFIaRyBfKqeRxTKRV3EH1mbvCc1XhBIAK9iiKLQBS8', '2025-06-15 11:39:43', '2025-06-15 11:39:43'),
(110, 'OID10621f3a05', 1, 5, 113, '2025-06-15 18:44:21', 'pending', 55000.00, NULL, 'cs_test_b1ZXm8Giqf73gtwUdBH6YNXBLZDFli199pAI3uw55jv6kn4ODEfAQktrKf', '2025-06-15 11:44:21', '2025-06-15 11:44:21'),
(111, 'OIDde476ee3c0', 1, 5, 114, '2025-06-15 18:45:42', 'completed', 55000.00, NULL, 'f5d035a7-6b03-4272-9e97-9437e85ad240', '2025-06-15 11:45:42', '2025-06-15 11:45:42'),
(112, 'OID849fd734a4', 1, 5, 115, '2025-06-17 15:18:39', 'pending', 10000.00, NULL, 'cs_test_b1AKyALZTHI05TKMywSGyNGp2hGaPD7gCItd28txFRGXOjB1DZRvMqo1UN', '2025-06-17 08:18:40', '2025-06-17 08:18:40'),
(113, 'OIDf31df3af5f', 1, 5, 116, '2025-06-17 15:24:54', 'completed', 55000.00, NULL, '14a5d0fe-864a-40af-b628-3899c90dc6c1', '2025-06-17 08:24:54', '2025-06-17 08:24:54'),
(114, 'OID62cad75261', 1, 5, 117, '2025-06-17 15:29:57', 'pending', 10000.00, NULL, 'cs_test_b1DC3yCJrvRozaHRy80X0tKl8LxgkQs9SyhLa4oopmyy4ttIlBbEGIdMbO', '2025-06-17 08:29:57', '2025-06-17 08:29:57'),
(115, 'OID54e7d8245c', 1, 5, 118, '2025-06-17 15:33:31', 'completed', 55000.00, NULL, '722cbc54-9f30-4923-a343-04bdd3a209a3', '2025-06-17 08:33:31', '2025-06-17 08:33:31'),
(116, 'OID3e895e836f', 1, 5, 119, '2025-06-17 15:34:45', 'pending', 55000.00, NULL, 'cs_test_b1JUeQJgr2aSPivPs3ml69eSPSSim0j6W5XEBmngPwHkWfVRYvi5KepXYJ', '2025-06-17 08:34:50', '2025-06-17 08:34:50'),
(117, 'OIDaca1a5da13', 1, 5, 120, '2025-06-17 15:39:56', 'completed', 55000.00, NULL, '9641fa40-e101-46ba-b680-87ca8b3e93b1', '2025-06-17 08:39:56', '2025-06-17 08:39:56'),
(118, 'OIDcbeb64ec2e', 1, 5, 121, '2025-06-17 15:40:34', 'completed', 55000.00, NULL, '750e9573-a0ad-47a7-b30b-a1415546c1a7', '2025-06-17 08:40:34', '2025-06-17 08:40:34'),
(119, 'OID717f93e39b', 1, 5, 122, '2025-06-17 15:41:05', 'completed', 55000.00, NULL, 'dc626726-e7b9-4a1d-8269-56cd144b7bc9', '2025-06-17 08:41:05', '2025-06-17 08:41:05'),
(120, 'OID03ab2d05f5', 1, 5, 123, '2025-06-17 15:42:05', 'completed', 55000.00, NULL, '0970d9d6-5e0b-4c49-8b9f-6e8fc2f22198', '2025-06-17 08:42:05', '2025-06-17 08:42:05'),
(121, 'OID926bbd5d2d', 1, 5, 124, '2025-06-17 15:43:08', 'pending', 55000.00, NULL, 'cs_test_b1GNA89GHj3khLMIds2SWYLRNSOt2aAazpSWBZBnXI2SVjeviWngJ8ZQEI', '2025-06-17 08:43:09', '2025-06-17 08:43:09'),
(122, 'OID0afc045028', 1, 5, 125, '2025-06-17 15:48:59', 'pending', 10000.00, NULL, 'cs_test_b1afiAT29rubyBpZ9CeVoACjGcYlVVsxcWlvmmZ7TJhCKsqmUubqd2aVg2', '2025-06-17 08:49:00', '2025-06-17 08:49:00'),
(123, 'OID13ff936d63', 1, 5, 126, '2025-06-17 15:50:48', 'pending', 10000.00, NULL, 'cs_test_b1Ikelg23K28rlNTdg0YiFLGm0sKekm7S9paNw3DVFs6I89h5m2hPzUAIx', '2025-06-17 08:50:49', '2025-06-17 08:50:49'),
(124, 'OIDa382b6a847', 1, 5, 127, '2025-01-01 15:53:18', 'pending', 10000.00, NULL, 'cs_test_b1muSmymaZJqakaoiOfwjkIpVXoT7lh119x70EaKfBjybLBpnuNEJQNxFL', '2025-01-01 08:53:19', '2025-01-01 08:53:19'),
(125, 'OIDa3296dae54', 1, 5, 128, '2025-07-03 10:02:17', 'pending', 55000.00, NULL, 'cs_test_b1OEhbcbR3n7CTbHaUARk7B59Fa5fqNQoOEDDmAFTrY74Z5utZXnlekIST', '2025-07-03 02:02:20', '2025-07-03 02:02:20'),
(126, 'OIDae0d9bea45', 1, 5, 129, '2025-07-03 10:02:20', 'pending', 55000.00, NULL, 'cs_test_b15DbMPrnh6IKkBFDI8TA6kOhM8MKnqnuDlvonI6lNVsIuQb2hmeHgaoST', '2025-07-03 02:02:21', '2025-07-03 02:02:21'),
(127, 'OID95e0737588', 1, 5, 130, '2025-07-03 10:02:30', 'completed', 55000.00, NULL, 'f7f82048-7fa5-4932-a082-3bcb9efd5143', '2025-07-03 02:02:30', '2025-07-03 02:02:30');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `Payment_ID` varchar(255) NOT NULL,
  `Order_ID` int(11) NOT NULL,
  `Payment_Status` varchar(255) NOT NULL,
  `Payment_Method` varchar(255) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `Currency` varchar(3) NOT NULL DEFAULT 'LAK',
  `Payment_Intent_ID` varchar(255) NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`Payment_ID`, `Order_ID`, `Payment_Status`, `Payment_Method`, `Amount`, `Currency`, `Payment_Intent_ID`, `Created_At`, `Updated_At`) VALUES
('04a3261a20964b9', 120, 'paid', 'on delivery', 5500000.00, 'lak', '6f8a6ecf-a', '2025-06-17 08:42:05', '2025-06-17 08:42:05'),
('3e46a813ac0744e', 115, 'paid', 'on delivery', 5500000.00, 'lak', '5512caac-3', '2025-06-17 08:33:31', '2025-06-17 08:33:31'),
('605bff64aea940a', 127, 'paid', 'on delivery', 5500000.00, 'lak', '3eec4493-8', '2025-07-03 02:02:30', '2025-07-03 02:02:30'),
('a1d1048be2d24f0', 118, 'paid', 'on delivery', 5500000.00, 'lak', '2e2ef288-e', '2025-06-17 08:40:34', '2025-06-17 08:40:34'),
('ce5c980cf3c34b4', 119, 'paid', 'on delivery', 5500000.00, 'lak', '8a11b394-3', '2025-06-17 08:41:05', '2025-06-17 08:41:05'),
('d6113834fa5e4e7', 111, 'paid', 'on delivery', 5500000.00, 'lak', '80d6937c-f', '2025-06-15 11:45:42', '2025-06-15 11:45:42'),
('d965d498ed434e8', 113, 'paid', 'on delivery', 5500000.00, 'lak', 'e748c1bf-5', '2025-06-17 08:24:54', '2025-06-17 08:24:54'),
('dfbc38a8eda5476', 117, 'paid', 'on delivery', 5500000.00, 'lak', 'dd3a5053-8', '2025-06-17 08:39:56', '2025-06-17 08:39:56'),
('pi_3RaEpL4c05uxt3S10e65KCcS', 105, 'paid', 'card', 5000000.00, 'lak', 'pi_3RaEpL4c05uxt3S10e65KCcS', '2025-06-15 11:34:18', '2025-06-15 11:34:18'),
('pi_3RaErR4c05uxt3S103OpOyQ7', 106, 'paid', 'card', 5000000.00, 'lak', 'pi_3RaErR4c05uxt3S103OpOyQ7', '2025-06-15 11:36:29', '2025-06-15 11:36:29');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `Product_ID` int(11) NOT NULL,
  `PID` varchar(20) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Brand` varchar(50) DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Description` text DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `productType_ID` int(11) NOT NULL,
  `Added_By` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`Product_ID`, `PID`, `Name`, `Brand`, `Price`, `Description`, `Status`, `Image`, `productType_ID`, `Added_By`) VALUES
(8, 'P002', 'Clarks Tilden Cap', 'Clarks', 1800.00, 'ເກີບເຮັດວຽກສຳລັບຊາຍ', 'ມີຂາຍ', 'http://bounhieng.asunasao.site/bounhieng.jpg', 2, ''),
(9, 'P003', 'Gucci Ace Sneaker', 'Gucci', 5500.00, 'ເກີບແຟຊັ່ນດັ່ງ', 'ໝົດ', 'http://bounhieng.asunasao.site/bounhieng.jpg', 3, 'admin'),
(10, 'P004', 'Adidas Adilette Slides', 'Adidas', 600.00, 'ເກີບໃສ່ທຸກມື້', 'ມີຂາຍ', 'http://bounhieng.asunasao.site/bounhieng.jpg', 1, ''),
(11, 'P005', 'Timberland PRO Work Boots', 'Timberland', 3200.00, 'ເກີບສຳລັບການເຮັດວຽກ', 'ມີຂາຍ', 'http://bounhieng.asunasao.site/bounhieng.jpg', 5, ''),
(12, 'P006', 'Cozy Home Slippers', 'Cozy', 400.00, 'ເກີບໃສ່ໃນເຮືອນ', 'ໝົດ', 'http://bounhieng.asunasao.site/bounhieng.jpg', 4, 'adminnn'),
(13, 'PID76d36b435ec148cba', 'unik', 'gg', 20000.00, '', 'ມີຂາຍ', 'gg', 2, 'admin'),
(14, 'PID626658cd4,d548d8b', 'unik', 'gg', 20000.00, 'test', 'ມີຂາຍ', 'gg', 2, 'admin'),
(15, 'PID,,2b6144c9fa446ea', 'unik', 'gg', 20000.00, 'test', 'ມີຂາຍ', 'ggffddd', 3, 'admin'),
(16, 'PID8ea45a7,2ef64f399', 'unik', 'gg', 20000.00, 'test', 'ໝົດ', 'ggf', 3, 'admin'),
(17, 'PID6d98e,58f4ba4a8fa', 'uniklkkkkkk', 'ggffef', 30000.00, 'tstes', 'ມີຂາຍ', 'ggffeffef', 2, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `product_types`
--

CREATE TABLE `product_types` (
  `productType_ID` int(11) NOT NULL,
  `productType_Name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_types`
--

INSERT INTO `product_types` (`productType_ID`, `productType_Name`) VALUES
(1, 'ເກີບກິລາ'),
(2, 'ເກີບເຮັດວຽກ\r\n'),
(3, 'ເກີບແຟຊັ່ນ'),
(4, 'ເກີບໃສ່ເຮືອນ'),
(5, 'ເກີບບູດ');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `Review_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Rating` int(11) NOT NULL,
  `Comment` text DEFAULT NULL,
  `Review_Date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `Role_id` int(11) NOT NULL,
  `Role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`Role_id`, `Role_name`) VALUES
(1, 'admin'),
(2, 'manager'),
(3, 'customer'),
(4, 'staff');

-- --------------------------------------------------------

--
-- Table structure for table `shipment`
--

CREATE TABLE `shipment` (
  `Shipment_ID` int(11) NOT NULL,
  `Tracking_Number` varchar(50) NOT NULL,
  `Ship_Status` varchar(20) NOT NULL,
  `Ship_Date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipment`
--

INSERT INTO `shipment` (`Shipment_ID`, `Tracking_Number`, `Ship_Status`, `Ship_Date`) VALUES
(67, '6fdad788-0', 'preparing', '2025-05-27 14:04:47'),
(68, '6300fae6-8', 'preparing', '2025-05-27 14:10:59'),
(69, 'e19ba4ca-5', 'preparing', '2025-05-27 14:12:32'),
(70, '48fe3c96-9', 'preparing', '2025-05-27 14:14:00'),
(71, '022041ce-d', 'preparing', '2025-05-27 14:18:34'),
(72, '3079f8ac-7', 'preparing', '2025-05-27 14:19:08'),
(73, 'c279dbc6-2', 'preparing', '2025-05-27 14:19:45'),
(74, '4f791c51-2', 'preparing', '2025-05-27 14:26:00'),
(75, 'f28e4363-5', 'preparing', '2025-05-27 14:30:24'),
(76, '8dc114aa-f', 'preparing', '2025-05-27 14:30:24'),
(77, 'ce30240a-9', 'preparing', '2025-05-27 14:37:28'),
(78, '9d212cf9-9', 'preparing', '2025-05-27 14:42:05'),
(79, 'c9bff8a1-7', 'preparing', '2025-05-27 14:43:58'),
(80, '5ff380f4-1', 'preparing', '2025-05-27 14:48:54'),
(81, '27d7c1d5-9', 'preparing', '2025-05-27 14:54:32'),
(82, '9bc5d9de-2', 'preparing', '2025-05-27 15:03:43'),
(83, '47f99933-1', 'preparing', '2025-05-27 15:05:16'),
(84, '8b1f4980-d', 'preparing', '2025-05-27 15:05:49'),
(85, '66df778e-4', 'preparing', '2025-05-27 15:07:41'),
(86, 'b18f8476-7', 'preparing', '2025-05-27 15:08:34'),
(87, 'a1daeea1-b', 'preparing', '2025-05-27 15:09:04'),
(88, '0e21e168-c', 'preparing', '2025-05-27 15:14:06'),
(89, '6bada6fe-2', 'preparing', '2025-05-27 15:16:28'),
(90, '9c8e761a-7', 'preparing', '2025-05-27 15:16:59'),
(91, '17347812-f', 'preparing', '2025-05-27 15:40:09'),
(92, 'a8598728-2', 'preparing', '2025-05-27 15:47:41'),
(93, '2ffcf09b-7', 'preparing', '2025-05-27 16:04:04'),
(94, '660de69c-c', 'preparing', '2025-05-27 16:05:22'),
(95, 'fc043fb7-a', 'preparing', '2025-05-27 16:07:41'),
(96, '25969860-a', 'preparing', '2025-05-27 16:07:52'),
(97, 'aeb26015-6', 'preparing', '2025-05-27 16:08:04'),
(98, '32e8e399-c', 'preparing', '2025-05-27 16:18:20'),
(99, '37b154f1-a', 'preparing', '2025-05-27 16:23:19'),
(100, '3a262c3c-9', 'preparing', '2025-06-15 16:25:14'),
(101, '20494f3a-a', 'preparing', '2025-06-15 16:28:34'),
(102, 'b905112b-4', 'preparing', '2025-06-15 16:29:52'),
(103, '91b1b398-3', 'preparing', '2025-06-15 16:31:12'),
(104, '8e318469-d', 'preparing', '2025-06-15 16:33:06'),
(105, 'ffc9f3a7-4', 'preparing', '2025-06-15 18:21:04'),
(106, 'dc7222d4-a', 'preparing', '2025-06-15 18:21:45'),
(107, 'b7f16943-7', 'preparing', '2025-06-15 18:22:44'),
(108, '4b1d1fa4-1', 'preparing', '2025-06-15 18:34:07'),
(109, 'fb0c8066-d', 'preparing', '2025-06-15 18:36:16'),
(110, '22d8cd1e-1', 'preparing', '2025-06-15 18:37:15'),
(111, '88550cd3-d', 'preparing', '2025-06-15 18:38:51'),
(112, '4b9abbd6-4', 'preparing', '2025-06-15 18:39:43'),
(113, 'c53c607b-6', 'preparing', '2025-06-15 18:44:21'),
(114, 'b6a899b6-4', 'preparing', '2025-06-15 18:45:42'),
(115, 'ef0b7293-a', 'preparing', '2025-06-17 15:18:40'),
(116, '1534e41b-3', 'preparing', '2025-06-17 15:24:54'),
(117, '10d135c1-0', 'preparing', '2025-06-17 15:29:57'),
(118, '9450b266-d', 'preparing', '2025-06-17 15:33:31'),
(119, 'ab1eef78-6', 'preparing', '2025-06-17 15:34:50'),
(120, '75533c7d-a', 'preparing', '2025-06-17 15:39:56'),
(121, 'f2c5607b-3', 'preparing', '2025-06-17 15:40:34'),
(122, 'ab7437c8-a', 'preparing', '2025-06-17 15:41:05'),
(123, '92cd0c57-a', 'preparing', '2025-06-17 15:42:05'),
(124, '4c386e11-c', 'preparing', '2025-06-17 15:43:09'),
(125, '5b893e6a-f', 'preparing', '2025-06-17 15:49:00'),
(126, '3a120b7b-1', 'preparing', '2025-06-17 15:50:49'),
(127, '49a6032f-6', 'preparing', '2025-06-17 15:53:19'),
(128, '5a0ee7aa-6', 'preparing', '2025-07-03 10:02:20'),
(129, '983656c6-4', 'preparing', '2025-07-03 10:02:21'),
(130, '755c0fcd-9', 'preparing', '2025-07-03 10:02:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_ID` int(11) NOT NULL,
  `UID` varchar(20) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Datebirth` date DEFAULT NULL,
  `Sex` varchar(10) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Images` varchar(255) DEFAULT NULL,
  `Registration_Date` timestamp NOT NULL DEFAULT current_timestamp(),
  `Role_id` int(11) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_ID`, `UID`, `FirstName`, `LastName`, `Email`, `Phone`, `Datebirth`, `Sex`, `Password`, `Images`, `Registration_Date`, `Role_id`, `reset_token`, `reset_token_expires`, `created_at`, `updated_at`) VALUES
(1, 'U250501', 'Admin', 'naja', 'admin@user.com', '00000000', '1990-01-01', 'M', '$2b$10$bzMhuR9PnkGTt0sn9IspH.Skb6JzmS6tshjwEV.DzL9btuppcPTe.', NULL, '2025-05-08', 1, NULL, NULL, '2025-06-13 08:36:08', '2025-06-13 08:36:08'),
(2, 'U2505502', 'Managerrr', 'naja', 'manager@user.com', '00000001', '1990-01-01', 'Male', '$2b$10$CMIBUotmzSxyzQchCPw5FuhPTehkU88llKEsQ3mJ6T5n3nWr2G4ZG', NULL, '2025-05-10', 2, NULL, NULL, '2025-06-13 08:36:08', '2025-06-13 08:36:08'),
(41, 'U25055503', 'Customer', 'naja', 'customer@user.com', '00000001', '1990-01-01', 'M', '$2b$10$aQzjtl/KlFZqrKjUYah98uXcsYwHTL3M1Cf6oAJUmiaxIp5lT2tsa', NULL, '2025-05-10', 3, NULL, NULL, '2025-06-13 08:36:08', '2025-06-13 08:36:08'),
(44, 'U250555504', 'John', 'Doe', 'john.doe@example.com', '0123456789', '1990-01-01', 'Male', '$2b$10$TP1NgIfb8p1kRLAM8TrmDuSu2lVQxypPykImg9yRCoxCTEg94vREi', NULL, '2025-05-10', 3, NULL, NULL, '2025-06-13 08:36:08', '2025-06-13 08:36:08'),
(45, 'U2505555505', 'Tengss', 'SP', 'Teng@gmail.com', '02093348466', '2004-09-20', 'Male', '$2b$10$CAWdnkG0Li/1Az8djNuqpe3IgtUiHmXLbttvOryCaRoE48WuSo/Q6', NULL, '2025-05-10', 2, NULL, NULL, '2025-06-13 08:36:08', '2025-06-13 08:36:08');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `Wishlist_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Date_Added` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`Wishlist_ID`, `User_ID`, `Product_ID`, `Date_Added`) VALUES
(9, 45, 10, '2025-05-27 15:45:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`Activity_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Activity_Type` (`Activity_Type`);

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`Address_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`Cart_ID`),
  ADD UNIQUE KEY `CID` (`CID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Product_ID` (`Product_ID`),
  ADD KEY `fk_order` (`Order_ID`);

--
-- Indexes for table `discount_codes`
--
ALTER TABLE `discount_codes`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Code` (`Code`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`Inventory_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

--
-- Indexes for table `monthly_targets`
--
ALTER TABLE `monthly_targets`
  ADD PRIMARY KEY (`Target_ID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Order_ID`),
  ADD UNIQUE KEY `OID` (`OID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Address_ID` (`Address_ID`),
  ADD KEY `Shipment_ID` (`Shipment_ID`),
  ADD KEY `FK_Discount_Code` (`Discount_Code_Id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`Payment_ID`),
  ADD KEY `fk_payment_order` (`Order_ID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`Product_ID`),
  ADD UNIQUE KEY `PID` (`PID`),
  ADD KEY `fk_pdType` (`productType_ID`);

--
-- Indexes for table `product_types`
--
ALTER TABLE `product_types`
  ADD PRIMARY KEY (`productType_ID`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`Review_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`Role_id`);

--
-- Indexes for table `shipment`
--
ALTER TABLE `shipment`
  ADD PRIMARY KEY (`Shipment_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `UID` (`UID`),
  ADD KEY `Role_id` (`Role_id`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`Wishlist_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `Activity_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `Address_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `Cart_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;

--
-- AUTO_INCREMENT for table `discount_codes`
--
ALTER TABLE `discount_codes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `Inventory_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `monthly_targets`
--
ALTER TABLE `monthly_targets`
  MODIFY `Target_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Order_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `Product_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `product_types`
--
ALTER TABLE `product_types`
  MODIFY `productType_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `Review_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `Role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `shipment`
--
ALTER TABLE `shipment`
  MODIFY `Shipment_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `Wishlist_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `products` (`Product_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order` FOREIGN KEY (`Order_ID`) REFERENCES `orders` (`Order_ID`);

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`Product_ID`) REFERENCES `products` (`Product_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_Discount_Code` FOREIGN KEY (`Discount_Code_Id`) REFERENCES `discount_codes` (`Id`),
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`Address_ID`) REFERENCES `address` (`Address_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`Shipment_ID`) REFERENCES `shipment` (`Shipment_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_order` FOREIGN KEY (`Order_ID`) REFERENCES `orders` (`Order_ID`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_pdType` FOREIGN KEY (`productType_ID`) REFERENCES `product_types` (`productType_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `products` (`Product_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`Role_id`) REFERENCES `roles` (`Role_id`) ON UPDATE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `products` (`Product_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
