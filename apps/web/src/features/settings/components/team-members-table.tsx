interface Member {
  id: string
  name: string | null
  email: string
  role: string
}

export function TeamMembersTable({ members }: { members: Member[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Role
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {members.map((member) => (
            <tr key={member.id} className="transition-colors hover:bg-muted/30">
              <td className="px-6 py-4 font-medium">{member.name ?? '—'}</td>
              <td className="px-6 py-4 text-muted-foreground">{member.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    member.role === 'admin'
                      ? 'border border-amber-200/60 bg-amber-50 text-amber-700'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {member.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
