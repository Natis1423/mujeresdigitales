-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-03-2024 a las 06:35:48
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.0.25

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
-- Estructura de tabla para la tabla `establecimiento`
--

CREATE TABLE `establecimiento` (
  `Cod_Establ` int(10) NOT NULL,
  `Nom_Establ` varchar(100) NOT NULL,
  `Responsable_Establ` varchar(125) NOT NULL,
  `Direccion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `establecimiento`
--

INSERT INTO `establecimiento` (`Cod_Establ`, `Nom_Establ`, `Responsable_Establ`, `Direccion`) VALUES
(1, 'Salon comunal 1', 'David Ramirez ', 'calle 10 #34-10A'),
(2, 'Salon comunal 2 ', 'Santiago Castillo', 'cra 28 #34-12'),
(3, 'salon comunal 3', 'Paula Peña', 'calle 20 #50-10'),
(4, 'Salon comunal 4', 'Angelica Muñoz ', 'diagonal 5d #25'),
(5, 'salon comunal 5 ', 'Mateo Perez', 'cra 9 este #38-23'),
(6, 'Salon comunal 6', 'Angelica perez', 'calle 10 #20-12'),
(7, 'salon comunal 7', 'Angelica Perez', 'Calle 24a'),
(8, 'Salon comunal 8', 'Angelica Perez', 'Calle 34a #45');

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
(70, 'TI', 1012, '', '', 0, '', '', '', '', 'administrador', 2);

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
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `establecimiento`
--
ALTER TABLE `establecimiento`
  ADD PRIMARY KEY (`Cod_Establ`);

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
-- AUTO_INCREMENT de la tabla `establecimiento`
--
ALTER TABLE `establecimiento`
  MODIFY `Cod_Establ` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `manzanas`
--
ALTER TABLE `manzanas`
  MODIFY `Cod_Manzana` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `mujeres`
--
ALTER TABLE `mujeres`
  MODIFY `Id_Mujer` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `Cod_Serv` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `Cod_Solic` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
-- Filtros para la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD CONSTRAINT `FKServicio666512` FOREIGN KEY (`EstablecimientoCod_Establ`) REFERENCES `establecimiento` (`Cod_Establ`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `fkmuje` FOREIGN KEY (`FkMujeres`) REFERENCES `mujeres` (`Id_Mujer`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
