import type{ User } from '@transcendence/shared/srcs/types/user';

interface profileProps{
    user: User;
}

function Profile({user} : profileProps) {
    return (
        <div>
            <img src={user.avatar ?? undefined} alt={user.username} />
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            
            {user.projectMembership && user.projectMembership.length > 0 ? (
            <ul>
                {user.projectMembership.map((membership) => (
                    <li key={membership.id}>
                    {membership.project?.name ?? 'Unknown project'}
                    </li>
                ))}
            </ul>
            ) : (
                <p>No projects yet</p>
            )}
        </div>
    );
}

export default Profile;