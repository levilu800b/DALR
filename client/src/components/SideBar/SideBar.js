import React from "react";
import { Menu, Layout } from "antd";
import {
	LogoutOutlined,
	SettingOutlined,
	UsergroupAddOutlined,
	UserSwitchOutlined,
	OrderedListOutlined,
	SearchOutlined,
	DashboardOutlined,
	ProfileOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const items = [
	{ key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
	{ key: "profile", icon: <ProfileOutlined />, label: "Profile" },
	{
		key: "user",
		icon: <UserSwitchOutlined />,
		label: "User management",
		children: [
			{ key: "edit-users", icon: <UsergroupAddOutlined />, label: "Edit users" },
			{
				key: "user-list",
				icon: <OrderedListOutlined />,
				label: "List of users",
			},
		],
	},
	{
		key: "search",
		icon: <SearchOutlined />,
		label: "Search for users",
		children: [
			{
				key: "search-language",
				icon: <SearchOutlined />,
				label: "Search by language",
			},
			{
				key: "search-country",
				icon: <SearchOutlined />,
				label: "Search by country",
			},
			{ key: "search-city", icon: <SearchOutlined />, label: "Search by city" },
		],
	},
	{
		key: "setting",
		icon: <SettingOutlined />,
		label: "Settings",
		children: [{ key: "option", label: "Option" }],
	},
	{ key: "logout", icon: <LogoutOutlined />, label: "Logout" },
];

const Sidebar = ({ onMenuClick }) => {
	const renderMenuItems = (menuItems) =>
		menuItems.map((menuItem) =>
			menuItem.children ? (
				<Menu.SubMenu
					key={menuItem.key}
					icon={menuItem.icon}
					title={menuItem.label}
				>
					{renderMenuItems(menuItem.children)}
				</Menu.SubMenu>
			) : (
				<Menu.Item
					key={menuItem.key}
					icon={menuItem.icon}
					onClick={() => onMenuClick(menuItem.key)}
				>
					{menuItem.label}
				</Menu.Item>
			)
		);

	return (
		<Sider>
			<Menu mode="inline" style={{ height: "100%", borderRight: 0 }}>
				{renderMenuItems(items)}
			</Menu>
		</Sider>
	);
};

export default Sidebar;
