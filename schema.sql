-- ==========================================
-- ESQUEMA MAESTRO CAPORAL 1961 (V13 - SINCRONIZACIÓN TOTAL)
-- ==========================================

-- 1. TABLA DE MENÚ (CARTA DE AUTOR)
CREATE TABLE IF NOT EXISTS menu (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria TEXT NOT NULL,
  nombre_plato TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(12, 2) NOT NULL,
  imagen_url TEXT,
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA DE HABITACIONES (ECOPARADISE SUITES)
-- Requerida para el funcionamiento del Dashboard y el sistema de alojamiento
CREATE TABLE IF NOT EXISTS habitaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio_noche DECIMAL(12, 2) NOT NULL,
  imagen_url TEXT,
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABLA DE PERFILES DE CLIENTES (CLUB CAPORAL)
CREATE TABLE IF NOT EXISTS perfiles_clientes (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  celular TEXT,
  email TEXT,
  puntos INTEGER DEFAULT 0,
  visitas INTEGER DEFAULT 0,
  nivel_lealtad TEXT DEFAULT 'Bronce' CHECK (nivel_lealtad IN ('Bronce', 'Plata', 'Oro')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABLA DE MASCOTAS (SOPORTA MÚLTIPLES PERROS POR CLIENTE)
CREATE TABLE IF NOT EXISTS mascotas_clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES perfiles_clientes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  raza TEXT,
  notas_gourmet TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABLA DE RESERVAS (ESTRUCTURA COMPLETA)
CREATE TABLE IF NOT EXISTS reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  celular TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  personas INTEGER NOT NULL,
  con_mascota BOOLEAN DEFAULT false,
  nombre_mascota TEXT,                          
  es_experiencia_especial BOOLEAN DEFAULT false,
  tipo_evento TEXT DEFAULT 'Cena Estándar',
  incluye_alojamiento BOOLEAN DEFAULT false,
  tipo_alojamiento TEXT,
  duracion_estancia TEXT DEFAULT 'Solo Comida',
  detalles_especiales TEXT,
  platos_preseleccionados TEXT, -- Nueva columna para persistencia del menú
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'asistida')),
  user_id UUID REFERENCES auth.users(id),       
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABLA DE CATERING
CREATE TABLE IF NOT EXISTS cotizaciones_catering (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_cliente TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo_evento TEXT NOT NULL,
  fecha_evento DATE,
  num_personas INTEGER,
  mensaje TEXT,
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- BLOQUE DE REPARACIÓN MAESTRA (SINCRONIZACIÓN DE TODAS LAS COLUMNAS)
-- ==========================================

DO $$ 
BEGIN 
    -- Sincronización de 'con_mascota'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservas' AND column_name='con_mascota') THEN
        ALTER TABLE reservas ADD COLUMN con_mascota BOOLEAN DEFAULT false;
    END IF;

    -- Sincronización de 'nombre_mascota'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservas' AND column_name='nombre_mascota') THEN
        ALTER TABLE reservas ADD COLUMN nombre_mascota TEXT;
    END IF;

    -- Sincronización de 'es_experiencia_especial'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservas' AND column_name='es_experiencia_especial') THEN
        ALTER TABLE reservas ADD COLUMN es_experiencia_especial BOOLEAN DEFAULT false;
    END IF;

    -- Sincronización de 'tipo_evento'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservas' AND column_name='tipo_evento') THEN
        ALTER TABLE reservas ADD COLUMN tipo_evento TEXT DEFAULT 'Cena Estándar';
    END IF;

    -- Sincronización de 'incluye_alojamiento'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservas' AND column_name='incluye_alojamiento') THEN
        ALTER TABLE reservas ADD COLUMN incluye_alojamiento BOOLEAN DEFAULT false;
    END IF;

    -- Sincronización de 'tipo_alojamiento'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservas' AND column_name='tipo_alojamiento') THEN
        ALTER TABLE reservas ADD COLUMN tipo_alojamiento TEXT;
    END IF;

    -- Sincronización de 'duracion_estancia'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservas' AND column_name='duracion_estancia') THEN
        ALTER TABLE reservas ADD COLUMN duracion_estancia TEXT DEFAULT 'Solo Comida';
    END IF;

    -- Sincronización de 'detalles_especiales'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservas' AND column_name='detalles_especiales') THEN
        ALTER TABLE reservas ADD COLUMN detalles_especiales TEXT;
    END IF;

    -- Sincronización de 'platos_preseleccionados'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservas' AND column_name='platos_preseleccionados') THEN
        ALTER TABLE reservas ADD COLUMN platos_preseleccionados TEXT;
    END IF;

    -- Sincronización de 'user_id'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservas' AND column_name='user_id') THEN
        ALTER TABLE reservas ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;

    -- Sincronización de 'disponible' en menú
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu' AND column_name='disponible') THEN
        ALTER TABLE menu ADD COLUMN disponible BOOLEAN DEFAULT true;
    END IF;

END $$;

-- SEGURIDAD RLS (ROW LEVEL SECURITY)
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE habitaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones_catering ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mascotas_clientes ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACCESO DINÁMICAS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura pública del menú') THEN
        CREATE POLICY "Lectura pública del menú" ON menu FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura pública de habitaciones') THEN
        CREATE POLICY "Lectura pública de habitaciones" ON habitaciones FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Público puede reservar') THEN
        CREATE POLICY "Público puede reservar" ON reservas FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin gestiona todo menu') THEN
        CREATE POLICY "Admin gestiona todo menu" ON menu FOR ALL USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin gestiona todo habitaciones') THEN
        CREATE POLICY "Admin gestiona todo habitaciones" ON habitaciones FOR ALL USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin gestiona todo reservas') THEN
        CREATE POLICY "Admin gestiona todo reservas" ON reservas FOR ALL USING (auth.role() = 'authenticated');
    END IF;
EXCEPTION WHEN others THEN NULL; END $$;