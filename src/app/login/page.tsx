export const metadata = { title: "Acceso privado" };

export default function LoginPage() {
  return <div className="login-card"><h1>Acceder a Market Intelligence OS</h1><p>En remoto, la aplicación exige el token de administración configurado por el propietario. En desarrollo local el acceso es directo.</p><form action="/api/auth/login" method="post"><label><span>Token</span><input name="token" type="password" required autoComplete="current-password" /></label><button className="button button-primary" type="submit">Entrar</button></form></div>;
}
