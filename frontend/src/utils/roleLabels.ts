export function getRoleLabel(identifier: string): string {
  switch (identifier) {
    case "master":
      return "Master";
    case "admin":
      return "Administrador";
    case "user":
      return "Usuário";
    case "consumer":
      return "Consumidor";
    case "company":
      return "Empresa";
    default:
      return identifier.charAt(0).toUpperCase() + identifier.slice(1).toLowerCase();
  }
}
