import { IUserEntity } from "../../../api/v1/users/models/user.entity";
import { getUID } from "../../../api/v1/common/utils/common.util";

export async function getUserSeeds(): Promise<IUserEntity[]> {
    const now = new Date();

    const users: IUserEntity[] = [
        {
            id: getUID(),
            fullName: "John Doe",
            avatar: null,
            bio: "Tech enthusiast & blogger.",
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
            fullName: "Editor Guy",
            avatar: null,
            bio: "Editor at BlogVerse.",
            socialLinks: { twitter: null, linkedin: null, github: null, website: null },
            followers: [],
            following: [],
            preferences: { emailNotifications: false, marketingUpdates: false, twoFactorAuth: false },
            createdAt: now,
            updatedAt: now
        },
        {
            id: getUID(),
            fullName: "Author Lady",
            avatar: null,
            bio: "Writes about design & frontend.",
            socialLinks: { twitter: null, linkedin: null, github: null, website: null },
            followers: [],
            following: [],
            preferences: { emailNotifications: true, marketingUpdates: true, twoFactorAuth: false },
            createdAt: now,
            updatedAt: now
        },
        {
            id: getUID(),
            fullName: "Admin Master",
            avatar: null,
            bio: "System administrator.",
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

    dummyNames.forEach(([fullName]) => {
        users.push({
            id: getUID(),
            fullName,
            avatar: null,
            bio: "Generated test user.",
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
