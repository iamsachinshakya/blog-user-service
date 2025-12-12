import { IUserEntity, UserRole, UserStatus } from "../../../api/v1/users/models/user.entity";
import { getUID } from "../../../api/v1/common/utils/common.util";

export async function getUserSeeds(): Promise<IUserEntity[]> {
    const now = new Date();

    const users: IUserEntity[] = [
        {
            id: getUID(),
            username: "john_doe",
            email: "john@example.com",
            fullName: "John Doe",
            avatar: null,
            bio: "Tech enthusiast & blogger.",
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
            isVerified: true,
            socialLinks: {
                twitter: "https://twitter.com/john_doe",
                linkedin: null,
                github: null,
                website: null
            },
            followers: [],
            following: [],
            preferences: { emailNotifications: true, marketingUpdates: false, twoFactorAuth: false },
            createdAt: now,
            updatedAt: now
        },
        {
            id: getUID(),
            username: "editor_guy",
            email: "editor@example.com",
            fullName: "Editor Guy",
            avatar: null,
            bio: "Editor at BlogVerse.",
            role: UserRole.EDITOR,
            status: UserStatus.ACTIVE,
            isVerified: false,
            socialLinks: { twitter: null, linkedin: null, github: null, website: null },
            followers: [],
            following: [],
            preferences: { emailNotifications: false, marketingUpdates: false, twoFactorAuth: false },
            createdAt: now,
            updatedAt: now
        },
        {
            id: getUID(),
            username: "author_lady",
            email: "author@example.com",
            fullName: "Author Lady",
            avatar: null,
            bio: "Writes about design & frontend.",
            role: UserRole.AUTHOR,
            status: UserStatus.ACTIVE,
            isVerified: true,
            socialLinks: { twitter: null, linkedin: null, github: null, website: null },
            followers: [],
            following: [],
            preferences: { emailNotifications: true, marketingUpdates: true, twoFactorAuth: false },
            createdAt: now,
            updatedAt: now
        },
        {
            id: getUID(),
            username: "admin_master",
            email: "admin@example.com",
            fullName: "Admin Master",
            avatar: null,
            bio: "System administrator.",
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            isVerified: true,
            socialLinks: { twitter: null, linkedin: null, github: null, website: null },
            followers: [],
            following: [],
            preferences: { emailNotifications: true, marketingUpdates: false, twoFactorAuth: true },
            createdAt: now,
            updatedAt: now
        },
    ];

    // ---- Generate 11 More Dummy Users ----
    const dummyNames = [
        ["sarah_lee", "Sarah Lee"],
        ["tech_bro", "Michael Brown"],
        ["writer_girl", "Emily Carter"],
        ["photo_guy", "James Walker"],
        ["data_junkie", "Olivia Jones"],
        ["dev_master", "Robert King"],
        ["frontend_dev", "Sophia Turner"],
        ["backend_ninja", "Liam Scott"],
        ["ux_researcher", "Isabella Clark"],
        ["ai_enthusiast", "Henry Wilson"],
        ["cyber_guard", "Noah Mitchell"]
    ];

    dummyNames.forEach(([username, fullName], index) => {
        users.push({
            id: getUID(),
            username,
            email: `${username}@example.com`,
            fullName,
            avatar: null,
            bio: "Generated test user.",
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
            isVerified: index % 2 === 0,
            socialLinks: { twitter: null, linkedin: null, github: null, website: null },
            followers: [],
            following: [],
            preferences: {
                emailNotifications: true,
                marketingUpdates: false,
                twoFactorAuth: false
            },
            createdAt: now,
            updatedAt: now
        });
    });

    return users;
}
