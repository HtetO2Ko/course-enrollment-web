import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router";

import { useAuth } from "../../context/AuthContext";

import { useMyProfile } from "../../features/account/hooks/useMyProfile";
import { useUpdateProfile } from "../../features/account/hooks/useUpdateProfile";
import { useMyEnrollments } from "../../features/enrollments/hooks/useMyEnrollments";
import { useRemoveEnrollment } from "../../features/account/hooks/useRemoveEnrollment";

import type { UpdateProfilePayload } from "../../features/account/types/account.types";
import { Globe } from "lucide-react";

export default function AccountPage() {
  const { isAuthenticated, user, updateUser } = useAuth();

  const profile = useMyProfile();
  const enrollments = useMyEnrollments();

  const updateProfile = useUpdateProfile();
  const removeEnrollment = useRemoveEnrollment();

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullname(profile.data.fullname);
      setPhone(profile.data.phone);
    }
  }, [profile.data]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Update profile
  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: UpdateProfilePayload = {
      fullname: fullname.trim(),
      phone: phone.trim(),
    };

    try {
      await updateProfile.mutateAsync(payload);

      // Immediately update the authenticated user's information.
      updateUser({
        fullname: payload.fullname,
      });
    } catch (error) {
      // Mutation error is displayed below.
      console.error("Profile update failed:", error);
    }
  };

  // Remove enrollment
  const handleRemoveEnrollment = (enrollmentid: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this enrollment?",
    );

    if (confirmed) {
      removeEnrollment.mutate(enrollmentid);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 py-8">
      {/* Page heading */}
      <div>
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-maincolor">My Account</h1>
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              aria-label="Open admin panel"
              title="Admin Panel"
              className="ml-4 text-maincolor transition-colors hover:text-selected-color"
            >
              <Globe className="h-5 w-5" />
            </Link>
          )}
        </div>

        <p className="mt-2 text-unselected-color">
          Manage your personal information and course enrollments.
        </p>
      </div>

      {/* Profile */}
      <section className="rounded-2xl border border-card-border bg-surface p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-maincolor">
          Personal Information
        </h2>

        {profile.isPending ? (
          <p>Loading profile...</p>
        ) : profile.isError ? (
          <p className="text-red-500">{profile.error.message}</p>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-maincolor">
                Username
              </label>

              <input
                value={profile.data?.username ?? ""}
                disabled
                className="w-full rounded-lg border border-card-border bg-maincolor/5 px-4 py-3 text-unselected-color"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-maincolor">
                Full Name
              </label>

              <input
                value={fullname}
                onChange={(event) => setFullname(event.target.value)}
                required
                className="w-full rounded-lg border border-card-border bg-surface px-4 py-3 text-maincolor outline-none focus:border-button-color"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-maincolor">
                Phone Number
              </label>

              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                className="w-full rounded-lg border border-card-border bg-surface px-4 py-3 text-maincolor outline-none focus:border-button-color"
              />
            </div>

            {updateProfile.isError && (
              <p className="text-sm text-red-500">
                {updateProfile.error.message}
              </p>
            )}

            {updateProfile.isSuccess && (
              <p className="text-sm text-green-600">
                Profile updated successfully.
              </p>
            )}

            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="rounded-lg bg-button-color px-6 py-3 font-semibold text-button-txt transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </section>

      {/* Enrollments */}
      {user?.role === "USER" && (
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-maincolor">
              My Course Enrollments
            </h2>

            <p className="mt-1 text-sm text-unselected-color">
              View your enrolled courses and waiting-list applications.
            </p>
          </div>

          {enrollments.isPending ? (
            <p>Loading enrollments...</p>
          ) : enrollments.isError ? (
            <p className="text-red-500">{enrollments.error.message}</p>
          ) : !enrollments.data?.length ? (
            <div className="rounded-xl border border-card-border p-8 text-center">
              <p className="font-medium text-maincolor">
                You haven't enrolled in any courses yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {enrollments.data.map((enrollment) => {
                const { batch } = enrollment;
                const { course } = batch;

                return (
                  <article
                    key={enrollment.enrollmentid}
                    className="overflow-hidden rounded-2xl border border-card-border bg-surface shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {course.imageURL && (
                        <img
                          src={course.imageURL}
                          alt={course.title}
                          className="h-48 w-full object-cover sm:h-auto sm:w-48"
                        />
                      )}

                      <div className="flex flex-1 flex-col justify-between gap-5 p-5">
                        <div>
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-medium text-unselected-color">
                              {batch.batchCode}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                enrollment.isWaiting
                                  ? "bg-yellow-500/10 text-yellow-600"
                                  : "bg-green-500/10 text-green-600"
                              }`}
                            >
                              {enrollment.isWaiting
                                ? "Waiting List"
                                : "Enrolled"}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-maincolor">
                            {course.title}
                          </h3>

                          <div className="mt-3 space-y-1 text-sm text-unselected-color">
                            <p>
                              Start Date:{" "}
                              {new Date(batch.startDate).toLocaleDateString()}
                            </p>

                            <p>
                              Class Days:{" "}
                              {batch.classDays
                                .map((day) => day.slice(0, 3))
                                .join(", ")}
                            </p>

                            <p>Class Time: {batch.classTime}</p>

                            <p>
                              Approval:{" "}
                              {enrollment.approved ? "Approved" : "Pending"}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveEnrollment(enrollment.enrollmentid)
                            }
                            disabled={removeEnrollment.isPending}
                            className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
                          >
                            {removeEnrollment.isPending
                              ? "Removing..."
                              : "Cancel Enrollment"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {removeEnrollment.isError && (
            <p className="mt-4 text-sm text-red-500">
              {removeEnrollment.error.message}
            </p>
          )}

          {removeEnrollment.isSuccess && (
            <p className="mt-4 text-sm text-green-600">
              Enrollment removed successfully.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
