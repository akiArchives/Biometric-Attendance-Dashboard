"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconLoader2, IconCheck } from "@tabler/icons-react";

// Default settings state
const defaultSettings = {
  // Profile
  adminName: "John Doe",
  adminEmail: "johndoe@clifsa.com",
  // Preferences
  theme: "system",
  defaultHomePage: "dashboard",
  // Shift Rules
  workStartTime: "09:00",
  gracePeriod: "15",
};

interface MemberProfile {
  id: string;
  email: string | null;
  role: string;
}

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [role, setRole] = useState<"admin" | "member" | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<MemberProfile[]>([]);

  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);
  const [banner, setBanner] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const updateSetting = (key: keyof typeof defaultSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    setMounted(true);

    // Load local settings
    const saved = localStorage.getItem("clifsa_attendance_settings");
    if (saved) {
      try {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }

    // Fetch user role and profiles list from Supabase
    const fetchUserAndProfiles = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          updateSetting("adminEmail", user.email || "");
          if (user.user_metadata?.name) {
            updateSetting("adminName", user.user_metadata.name);
          }

          // Fetch self role
          const { data: selfProfile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (selfProfile) {
            const userRole = selfProfile.role as "admin" | "member";
            setRole(userRole);

            // If user is admin, fetch all workspace profiles
            if (userRole === "admin") {
              const { data: allProfiles } = await supabase
                .from("profiles")
                .select("id, email, role")
                .order("email");

              if (allProfiles) {
                setProfiles(allProfiles as MemberProfile[]);
              }
            }
          } else {
            setRole("member");
          }
        }
      } catch (e) {
        console.error("Failed to load user credentials or profiles", e);
        setRole("member");
      }
    };

    fetchUserAndProfiles();
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10 space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-96" />
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleSaveAll = async () => {
    setIsSaving(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      localStorage.setItem(
        "clifsa_attendance_settings",
        JSON.stringify(settings),
      );

      // Opt-in: Update Supabase metadata name if it changed
      const supabase = createClient();
      if (
        currentUser &&
        settings.adminName !== currentUser.user_metadata?.name
      ) {
        await supabase.auth.updateUser({
          data: { name: settings.adminName },
        });
      }

      setBanner({
        show: true,
        type: "success",
        message: "Settings saved successfully.",
      });
      setTimeout(() => {
        setBanner((prev) => ({ ...prev, show: false }));
      }, 3000);
    } catch (e) {
      setBanner({
        show: true,
        type: "error",
        message: "Failed to save settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "admin" | "member",
  ) => {
    setIsUpdatingRole(userId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p)),
      );

      setBanner({
        show: true,
        type: "success",
        message: "User role updated successfully.",
      });
      setTimeout(() => {
        setBanner((prev) => ({ ...prev, show: false }));
      }, 3000);
    } catch (e) {
      console.error("Failed to update user role", e);
      setBanner({
        show: true,
        type: "error",
        message: "Failed to update user role.",
      });
    } finally {
      setIsUpdatingRole(null);
    }
  };

  const showAdminSettings = role === "admin";

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10 bg-background min-h-full">
      {/* HEADER */}

      {banner.show && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <IconCheck className="h-5 w-5 shrink-0" />
          <span className="font-medium">{banner.message}</span>
        </div>
      )}

      <div className="space-y-8">
        {/* ACCOUNT PROFILE */}
        <div className="space-y-5 border-b pb-8">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg pb-2">
            <h2 className="">Account Profile</h2>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/10 pb-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-foreground">
                  Display Name
                </Label>
                <p className="text-xs text-muted-foreground">
                  Customize how your name appears on the system.
                </p>
              </div>
              <Input
                id="adminName"
                value={settings.adminName}
                onChange={(e) => updateSetting("adminName", e.target.value)}
                placeholder="Enter display name"
                className="w-fit"
              />
            </div>

            <div className="flex items-center justify-between border-b border-border/10 pb-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-foreground">
                  Account Email
                </Label>
                <p className="text-xs text-muted-foreground">
                  Customize how your name appears on the system.
                </p>
              </div>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                disabled
                className="w-fit"
              />
            </div>

            {/*<div className="grid gap-2">
              <Label htmlFor="adminName">Display Name</Label>
              <Input
                id="adminName"
                value={settings.adminName}
                onChange={(e) => updateSetting("adminName", e.target.value)}
                placeholder="Enter display name"
                className="bg-muted/10 border-border/50 focus:bg-transparent"
              />
            <>
            <div className="grid gap-2">
              <Label htmlFor="adminEmail">Account Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                disabled
                className="bg-muted/20 border-border/40 text-muted-foreground cursor-not-allowed opacity-80"
              />
            </div>*/}
          </div>
        </div>

        {/*PREFERENCES */}
        <div className="space-y-5 border-b pb-8">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg pb-2">
            <h2>Preferences</h2>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/10 pb-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-foreground">
                  Appearance
                </Label>
                <p className="text-xs text-muted-foreground">
                  Customize how the dashboard theme looks on your device.
                </p>
              </div>
              <Select
                value={settings.theme}
                onValueChange={(val) => updateSetting("theme", val)}
              >
                <SelectTrigger className="w-36 h-9 bg-muted/20 border-border/50 justify-between">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pb-2">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-foreground">
                  Default Landing Page
                </Label>
                <p className="text-xs text-muted-foreground">
                  Choose which tab you land on when logging in.
                </p>
              </div>
              <Select
                value={settings.defaultHomePage}
                onValueChange={(val) => updateSetting("defaultHomePage", val)}
              >
                <SelectTrigger className="w-36 h-9 bg-muted/20 border-border/50 justify-between">
                  <SelectValue placeholder="Default Page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="logs">Daily Logs</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* SHIFT RULES (ADMIN ONLY) */}
        {showAdminSettings && (
          <div className="space-y-5 border-b pb-8">
            <div className="flex items-center gap-2 text-foreground font-semibold text-lg pb-2">
              <h2>Shift Rules</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="workStartTime">
                  Standard Work Start Time (24h)
                </Label>
                <Input
                  id="workStartTime"
                  type="text"
                  value={settings.workStartTime}
                  onChange={(e) =>
                    updateSetting("workStartTime", e.target.value)
                  }
                  placeholder="e.g. 09:00"
                  className="bg-muted/10 border-border/50 focus:bg-transparent"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gracePeriod">Late Grace Period</Label>
                <Select
                  value={settings.gracePeriod}
                  onValueChange={(val) => updateSetting("gracePeriod", val)}
                >
                  <SelectTrigger
                    id="gracePeriod"
                    className="w-full justify-between h-9 bg-muted/20 border-border/50"
                  >
                    <SelectValue placeholder="Select minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Grace Period</SelectItem>
                    <SelectItem value="5">5 Minutes</SelectItem>
                    <SelectItem value="10">10 Minutes</SelectItem>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* MEMBERS LIST (ADMIN ONLY) */}
        {showAdminSettings && profiles.length > 0 && (
          <div className="space-y-5 pb-8">
            <div className="flex items-center gap-2 text-foreground font-semibold text-lg pb-2">
              <h2>Workspace Members</h2>
            </div>
            <div className="border border-border/40 rounded-xl overflow-hidden bg-muted/5">
              <table className="w-full border-collapse text-sm text-left">
                <thead>
                  <tr className="bg-muted/10 text-muted-foreground font-medium border-b border-border/40">
                    <th className="p-3">Email Address</th>
                    <th className="p-3 text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {profiles.map((profile) => (
                    <tr
                      key={profile.id}
                      className="hover:bg-muted/5 transition-colors"
                    >
                      <td className="p-3 text-foreground font-medium">
                        {profile.email}
                      </td>
                      <td className="p-3 text-right">
                        {isUpdatingRole === profile.id ? (
                          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mr-3">
                            <IconLoader2 className="h-3 w-3 animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          <Select
                            value={profile.role}
                            onValueChange={(val) =>
                              handleRoleChange(
                                profile.id,
                                val as "admin" | "member",
                              )
                            }
                            disabled={profile.id === currentUser?.id} // Prevent editing self
                          >
                            <SelectTrigger className="w-28 h-8 bg-muted/20 border-border/50 justify-between inline-flex text-xs ml-auto">
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-5 text-sm"
          >
            {isSaving && <IconLoader2 className="h-4 w-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
