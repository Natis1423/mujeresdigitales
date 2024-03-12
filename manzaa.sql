-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-03-2024 a las 16:22:21
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `manzaa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manzanas`
--

CREATE TABLE `manzanas` (
  `Cod_Manzana` int(10) NOT NULL,
  `Nombre_Manzana` varchar(100) NOT NULL,
  `Localidad` varchar(25) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `Municipio` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `manzanas`
--

INSERT INTO `manzanas` (`Cod_Manzana`, `Nombre_Manzana`, `Localidad`, `Direccion`, `Municipio`) VALUES
(1, 'Bosa', 'Bosa', 'calle 10', 'Cundinamarca'),
(2, 'Chapinero', 'Chapinero', 'calle 10', 'Cundinamarca'),
(3, 'Suba', 'bosa', 'calle 234', 'cundinamarca');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manzanas_servicio`
--

CREATE TABLE `manzanas_servicio` (
  `Id_manzana1` int(10) DEFAULT NULL,
  `servicioCod_Serv` int(10) DEFAULT NULL,
  `Dia_Y_Hora` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `manzanas_servicio`
--

INSERT INTO `manzanas_servicio` (`Id_manzana1`, `servicioCod_Serv`, `Dia_Y_Hora`) VALUES
(1, 8, NULL),
(1, 6, NULL),
(1, 7, NULL),
(1, 9, NULL),
(3, 8, NULL),
(3, 5, NULL),
(3, 10, NULL),
(2, 4, NULL),
(2, 5, NULL),
(2, 6, NULL),
(2, 7, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mujeres`
--

CREATE TABLE `mujeres` (
  `Id_Mujer` int(10) NOT NULL,
  `Tipo_Documen` set('TI','CC') DEFAULT NULL,
  `Documento` bigint(19) NOT NULL,
  `Nombres` varchar(150) NOT NULL,
  `Apellidos` varchar(150) NOT NULL,
  `Tel` bigint(19) NOT NULL,
  `Correo_Elec` varchar(255) NOT NULL,
  `Ciudad` varchar(65) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `Ocupacion` varchar(80) NOT NULL,
  `ROL` set('usuario','administrador') DEFAULT 'usuario',
  `FkManzana` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mujeres`
--

INSERT INTO `mujeres` (`Id_Mujer`, `Tipo_Documen`, `Documento`, `Nombres`, `Apellidos`, `Tel`, `Correo_Elec`, `Ciudad`, `Direccion`, `Ocupacion`, `ROL`, `FkManzana`) VALUES
(70, '', 1012, '', '', 20000, '', '', '', '', 'administrador', 2),
(72, 'CC', 1011, 'NATA', 'RAMOS', 311204, 'nata142.ramos@gmail.com', 'Bogota', 'calle 102', 'no se', 'usuario', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `Cod_Serv` int(10) NOT NULL,
  `Nom_Serv` varchar(255) NOT NULL,
  `Descripc` varchar(255) NOT NULL,
  `Categ_Serv` varchar(255) NOT NULL,
  `Tipo_Serv` varchar(255) NOT NULL,
  `EstablecimientoCod_Establ` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`Cod_Serv`, `Nom_Serv`, `Descripc`, `Categ_Serv`, `Tipo_Serv`, `EstablecimientoCod_Establ`) VALUES
(4, 'Cine', 'Se reproducen peliculas ', 'Servicio', 'Entretenimiento ', 2),
(5, 'piscina', 'Se realizan clases de piscina ', 'Servicio', 'Deporte', 3),
(6, 'GYM ', 'Se dan servicios de gimnasio ', 'Servicio', 'Deportivo', 4),
(7, 'Cocina ', 'Se realizan clase de cocina ', 'Clase ', 'Gastronomia', 5),
(8, 'Lavanderia', 'Se realizan clases de lavanderia', 'Clase', 'Aseo', 6),
(9, 'Coser', 'Se realizan clases para coser', 'Clase', 'Maquinaria', 7),
(10, 'Yoga', 'Se realizan clases de yoga', 'Clase', 'Deporte', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `Cod_Solic` int(10) NOT NULL,
  `Hora` datetime DEFAULT NULL,
  `servicio` int(10) DEFAULT NULL,
  `FkMujeres` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`Cod_Solic`, `Hora`, `servicio`, `FkMujeres`) VALUES
(7, '2024-03-06 09:33:55', 5, 72);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `manzanas`
--
ALTER TABLE `manzanas`
  ADD PRIMARY KEY (`Cod_Manzana`);

--
-- Indices de la tabla `manzanas_servicio`
--
ALTER TABLE `manzanas_servicio`
  ADD KEY `fk_id2` (`Id_manzana1`),
  ADD KEY `fk_id3` (`servicioCod_Serv`);

--
-- Indices de la tabla `mujeres`
--
ALTER TABLE `mujeres`
  ADD PRIMARY KEY (`Id_Mujer`),
  ADD UNIQUE KEY `Documento` (`Documento`),
  ADD KEY `Fk_idmanzana` (`FkManzana`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`Cod_Serv`),
  ADD KEY `FKServicio666512` (`EstablecimientoCod_Establ`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`Cod_Solic`),
  ADD KEY `fkmuje` (`FkMujeres`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `manzanas`
--
ALTER TABLE `manzanas`
  MODIFY `Cod_Manzana` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `mujeres`
--
ALTER TABLE `mujeres`
  MODIFY `Id_Mujer` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `Cod_Serv` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `Cod_Solic` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `manzanas_servicio`
--
ALTER TABLE `manzanas_servicio`
  ADD CONSTRAINT `fk_id2` FOREIGN KEY (`Id_manzana1`) REFERENCES `manzanas` (`Cod_Manzana`),
  ADD CONSTRAINT `fk_id3` FOREIGN KEY (`servicioCod_Serv`) REFERENCES `servicio` (`Cod_Serv`);

--
-- Filtros para la tabla `mujeres`
--
ALTER TABLE `mujeres`
  ADD CONSTRAINT `Fk_idmanzana` FOREIGN KEY (`FkManzana`) REFERENCES `manzanas` (`Cod_Manzana`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `fkmuje` FOREIGN KEY (`FkMujeres`) REFERENCES `mujeres` (`Id_Mujer`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
