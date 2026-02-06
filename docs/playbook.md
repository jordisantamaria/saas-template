# Playbook de Consultoria

> Guia para sesiones de consultoria con clientes. Como presentar la plantilla, estructurar el proyecto, y gestionar la relacion.

---

## 1. Primera Reunion con el Cliente

### Objetivo
Entender el problema, validar que somos el fit correcto, y dar una estimacion inicial.

### Agenda (45-60 min)
1. **Escuchar** (15 min) — Que quieren construir, para quien, por que ahora
2. **Preguntas clave** (10 min) — Ver seccion abajo
3. **Demo de la plantilla** (10 min) — Mostrar lo que ya viene resuelto
4. **Propuesta de fases** (10 min) — Timeline y presupuesto tentativo
5. **Siguientes pasos** (5 min) — Que necesitamos de ellos

### Preguntas clave para el cliente
```
PRODUCTO
- Que problema resuelven? Para quien?
- Tienen usuarios o clientes ya? Cuantos esperan en 6 meses?
- Que funcionalidades son criticas para lanzar (MVP)?
- Cuales pueden esperar a la v2?

TECNICO
- Tienen equipo tecnico interno?
- Tienen diseno (Figma, wireframes)?
- Necesitan integraciones con APIs externas? Cuales?
- Tienen requisitos regulatorios (GDPR, PCI, etc.)?

NEGOCIO
- Modelo de monetizacion? (subscription, freemium, per-seat, usage-based)
- Presupuesto aproximado?
- Deadline? Hay algun evento clave (lanzamiento, ronda, etc.)?
- Necesitan app mobile? (ver seccion mobile)

CONTEXTO
- Han intentado construirlo antes? Que paso?
- Usan alguna herramienta ahora? (Excel, Notion, competidor)
- Quienes son los competidores directos?
```

### Cuando un cliente pide mobile
```
Respuesta estandar:

"La web responsive que entregamos funciona perfectamente en movil.
Se puede instalar como app (PWA) con icono en el home screen y
notificaciones push. Esto cubre el 90% de los casos.

Si mas adelante los datos muestran que necesitas app nativa,
nuestro sistema esta preparado para anadirla en una fase 2.
Esto te ahorra entre un 40-60% del coste de hacerlo todo de golpe."
```

---

## 2. Fases de Entrega

### Fase 0: Discovery & Setup (1 semana)
**Entregable:** Documento de requisitos + repo configurado

```
Lo que hacemos:
- Refinar requisitos con el cliente
- Definir MVP (max 5-7 features core)
- Crear repo desde la plantilla
- Configurar entornos (Vercel, Neon, Cloudflare)
- Personalizar tema (colores, fuente, logo del cliente)
- Configurar Auth.js con providers del cliente
- Crear schemas de DB especificos del proyecto

Lo que el cliente nos da:
- Logo en SVG
- Colores de marca (primary, secondary)
- Acceso a cuentas (Google OAuth credentials, Stripe, dominio)
- Lista priorizada de features
```

### Fase 1: MVP Core (2-4 semanas)
**Entregable:** App funcional con las features criticas

```
Lo que ya viene resuelto (0 esfuerzo):
- Auth (login, registro, sesiones)
- UI base (dashboard layout, componentes)
- Payments (checkout, subscriptions)
- Email transaccional
- Security (rate limiting, DDoS protection)
- Monitoring (errores, uptime)

Lo que construimos custom:
- Las 5-7 features especificas del cliente
- Schemas de DB del dominio
- Integraciones con APIs externas
- Landing page personalizada
```

### Fase 2: Polish & Launch (1-2 semanas)
**Entregable:** App lista para produccion

```
- Testing e2e de flujos criticos
- Performance optimization
- SEO de paginas publicas
- Configuracion de analytics (PostHog events)
- Documentacion basica para el equipo del cliente
- Deploy a produccion con dominio propio
- Configuracion de backups y monitoring
```

### Fase 3: Iteracion Post-Launch (ongoing)
**Entregable:** Mejoras basadas en datos reales

```
- Analisis de metricas (PostHog)
- Bugs y feedback de usuarios
- Features de la v2
- Optimizaciones de conversion
- Upsell: app mobile si los datos lo justifican
```

---

## 3. Timeline Estandar

```
Proyecto tipico SaaS (complejidad media):

Semana 1        Discovery + Setup
Semanas 2-4     MVP Core
Semana 5        Polish + Testing
Semana 6        Launch

Total: 6 semanas de idea a produccion
```

```
Proyecto simple (pocas features custom):

Semana 1        Discovery + Setup + MVP Core
Semana 2        MVP Core + Polish
Semana 3        Launch

Total: 3 semanas
```

```
Proyecto complejo (integraciones, regulacion):

Semanas 1-2     Discovery + Setup
Semanas 3-6     MVP Core
Semanas 7-8     Polish + Testing + Compliance
Semana 9        Launch

Total: 9 semanas
```

---

## 4. Lo que Viene Resuelto vs Lo que es Custom

### Ya resuelto en la plantilla (lo que NO cobramos como desarrollo)
Esto es nuestra ventaja competitiva. El cliente paga por lo custom, no por reinventar la rueda.

```
INFRA & DEVOPS
  Monorepo configurado con CI/CD
  Deploy automatico con preview por PR
  Cloudflare DDoS protection
  Database con backups automaticos
  Monitoring y alertas

AUTENTICACION
  Login con Google / social
  Magic link (sin contrasena)
  Proteccion de rutas
  Rate limiting en auth
  Sesiones seguras (JWT)

PAGOS
  Checkout de Stripe
  Gestion de subscripciones
  Portal de cliente (cambiar plan, cancelar)
  Webhooks procesados
  Facturas automaticas

UI & UX
  Design system con 20+ componentes
  Dashboard layout responsive
  Skeletons de carga
  Estados vacios
  Paginas de error (404, 500)
  Tema personalizable

EMAIL
  Templates transaccionales
  Welcome email
  Notificaciones de pago

SEGURIDAD
  Rate limiting por capa
  Security headers
  Input validation
  CSRF protection
  DDoS mitigation

MONITORING
  Error tracking (Sentry)
  Uptime monitoring
  Product analytics
  Logs estructurados
```

### Lo que construimos custom (lo que SI cobramos)
```
  Features especificas del dominio del cliente
  Schemas de DB del negocio
  Integraciones con APIs externas
  Logica de negocio especifica
  Landing page y copy
  Configuracion de branding
```

---

## 5. Gestion del Cliente

### Comunicacion
```
HERRAMIENTAS
- Slack/Discord: comunicacion diaria
- Linear/GitHub Issues: tareas y bugs
- Loom: demos asincronas semanales
- Meet/Zoom: reuniones de check-in (max 1/semana)

CADENCIA
- Demo asincrona: cada viernes (video Loom 5 min)
- Check-in call: semanal o bisemanal segun complejidad
- Feedback loop: cliente prueba en preview URL despues de cada demo
```

### Gestion de cambios de scope
```
Cuando el cliente pide algo nuevo mid-sprint:

1. "Buena idea. Vamos a anadirlo al backlog de la v2."
2. Si insisten: "Podemos incluirlo, pero desplaza [feature X] de esta fase."
3. Si es critico: "Lo incluimos. Esto extiende el timeline en [N dias] y el presupuesto en [N]."

Nunca decir que no. Siempre dar opciones con trade-offs claros.
```

### Handoff al equipo del cliente
```
Lo que entregamos al final:

1. Acceso al repo (GitHub) con toda la documentacion
2. Acceso a Vercel, Neon, Cloudflare, Stripe
3. CLAUDE.md configurado para que su equipo use Claude Code
4. Sesion de onboarding (1-2h) para su equipo tecnico
5. Documentacion de arquitectura y decisiones (este ADR)
6. 2 semanas de soporte post-launch incluidas
```

---

## 6. Objeciones Comunes

### "Es muy caro"
```
"Entiendo. Piensa que lo que te entregamos incluye autenticacion,
pagos, email, seguridad, monitoring y dashboard — todo listo.
Solo un equipo de 3-4 devs tardaria 3-4 meses en construir esto
desde cero. Nosotros te lo entregamos en 6 semanas porque ya lo
tenemos resuelto. Pagas por las features unicas de tu negocio,
no por la infraestructura."
```

### "Podemos hacerlo internos"
```
"Por supuesto. La pregunta es: cuanto cuesta en tiempo?
Si tu equipo tarda 4 meses en llegar a produccion, son 4 meses
sin clientes, sin revenue, sin feedback real. Con nosotros
estas en produccion en 6 semanas y tu equipo puede enfocarse
en iterar sobre lo que importa."
```

### "Quiero mobile desde el dia 1"
```
"El 90% de tus usuarios iniciales van a llegar por web.
Te entregamos una web que funciona perfecto en movil, se instala
como app, y tiene notificaciones push. Cuando tus metricas muestren
que >30% de uso es mobile, anadimos la app nativa. El sistema ya
esta preparado para ello. Asi no gastas el doble al inicio en algo
que quizas no necesitas aun."
```

### "Puedo usar un template de $99 de internet"
```
"Los templates genericos te dan una carcasa. No incluyen la
arquitectura para escalar, los modulos de pagos configurados,
la seguridad probada, ni el soporte. Ademas, cuando necesites
customizarlo, vas a gastar mas tiempo parcheando que si empiezas
con algo bien hecho. Nosotros te damos un producto, no un zip."
```

### "Quiero usar AWS"
```
"Tienes razon, AWS es excelente. Netflix, Airbnb, Spotify lo usan.
Pero esas empresas tienen equipos de DevOps de 10-50 personas.
Para una startup en fase de lanzamiento, AWS tiene un coste oculto:"

  AWS "barato":
    EC2/ECS + RDS + ALB + Route53 + S3 + CloudFront = ~$150-250/mes
    + DevOps para configurar y mantener (CI/CD, Docker, security groups,
      IAM, auto-scaling, SSL): freelance $3k-$8k/mes, o 2-3 semanas de tu equipo

  Nuestra infra (Vercel + Neon + Cloudflare):
    Todo incluido: $20/mes. DevOps: $0. Setup: 5 minutos.

"Te propongo esto: lanzamos con Vercel a $20/mes y estas en produccion
en 1 dia. Cuando factures +$50k/mes y quieras optimizar costes de infra,
migramos a AWS. La DB es PostgreSQL estandar, el codigo es Next.js —
la migracion es un cambio de deploy target, no una reescritura.
Asi no gastas $5k en DevOps antes de tener tu primer cliente."

Si aun insiste:
"Perfecto, podemos hacer el deploy en AWS. Eso anade [X semanas] al
timeline y [X euros] al presupuesto por configuracion de infra.
Quieres que lo incluyamos en la propuesta?"

Normalmente cuando ven el coste extra, eligen Vercel.
```

### "Que pasa si necesito cambiar de proveedor?"
```
"Cero lock-in. Tu codigo es tuyo, en tu GitHub. La base de datos
es PostgreSQL estandar — funciona en cualquier proveedor. El ORM
es Drizzle — cambias la connection string y funciona. Si manana
quieres ir a AWS, migramos la DB y apuntamos el deploy. No dependes
de ningun vendor propietario."
```

---

## 7. Metricas de Exito

### Para el cliente
- Time to market (semanas, no meses)
- Coste de infra ($0-$20/mes al inicio)
- Conversion rate (auth social > email/password)
- Uptime (>99.9% con Cloudflare + Vercel)

### Para la agencia
- Tiempo de entrega vs estimacion
- % de reutilizacion de la plantilla (target: 70%+ es plantilla, 30% es custom)
- NPS del cliente
- Rate de upsell (fase 2, mobile, mantenimiento)
- Margen por proyecto (mejora con cada proyecto gracias a packages reutilizables)
