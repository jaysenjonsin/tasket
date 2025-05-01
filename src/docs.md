Includes: Layouts, Pages, Database Collections, API Routes, File Tree

4 Main Layouts:
  1.Root layout (app wide functionality including React Query, Toaster)
  2.auth layout (sign in, sign up pages)
  3.dashboard layout (All modals, sidebar/navbar)
  4.standalone layout (link to home, user button)

Pages:
  Auth pages:
  /sign-in
  - Purpose: User login page
  - Layout: Auth layout with logo and sign-up link

  /sign-up
  - Purpose: New user registration page
  - Layout: Auth layout with logo and sign-in link

  Dashboard pages:
  /
  - Purpose: Main dashboard landing page
  - Layout: Dashboard layout with sidebar and navbar

  /workspaces/[workspaceId]
  - Purpose: Workspace overview page
  - Features: Analytics, recent activity
  - Layout: Dashboard layout

  /workspaces/[workspaceId]/projects/[projectId]
  - Purpose: Project details and management
  - Features: Project analytics, task management
  - Layout: Dashboard layout

  /workspaces/[workspaceId]/tasks
  - Purpose: Workspace task overview
  - Features: Task list, filters, search
  - Layout: Dashboard layout

  /workspaces/[workspaceId]/tasks/[taskId]
  - Purpose: Individual task details
  - Features: Task editing, status updates
  - Layout: Dashboard layout

  Standalone pages:
  /workspaces/create
  - Purpose: Create new workspace
  - Layout: Standalone layout with minimal navigation

  /workspaces/[workspaceId]/settings
  - Purpose: Workspace settings management
  - Features: Name, image, member management
  - Layout: Standalone layout

  /workspaces/[workspaceId]/members
  - Purpose: Member management page
  - Features: Member list, role management
  - Layout: Standalone layout

  /workspaces/[workspaceId]/join/[inviteCode]
  - Purpose: Workspace invitation acceptance
  - Features: Join workspace with invite code
  - Layout: Standalone layout

  /workspaces/[workspaceId]/projects/[projectId]/settings
  - Purpose: Project settings management
  - Features: Project name, image, configuration
  - Layout: Standalone layout

Database Collections:

  Table: members
  Columns:
    $id: string                  // Appwrite document ID
    $createdAt: string          // Timestamp
    $updatedAt: string          // Timestamp
    workspaceId: string         // Reference to workspace
    userId: string              // Reference to Appwrite user
    role: MemberRole            // Enum: 'ADMIN' | 'MEMBER'

  Table: workspaces
  Columns:
    $id: string                  // Appwrite document ID
    $createdAt: string          // Timestamp
    $updatedAt: string          // Timestamp
    name: string                // Workspace name
    imageUrl: string            // URL to workspace image
    inviteCode: string          // Unique invite code
    userId: string              // Creator/owner reference

    Table: projects
  Columns:
    $id: string                  // Appwrite document ID
    $createdAt: string          // Timestamp
    $updatedAt: string          // Timestamp
    name: string                // Project name
    imageUrl: string            // URL to project image
    workspaceId: string         // Reference to workspace

    Table: tasks
  Columns:
    $id: string                  // Appwrite document ID
    $createdAt: string          // Timestamp
    $updatedAt: string          // Timestamp
    status: TaskStatus          // Enum: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
    workspaceId: string         // Reference to workspace
    assigneeId: string          // Reference to member
    projectId: string           // Reference to project
    position: number            // Order position in kanban
    dueDate: string            // Task due date
    description?: string        // Optional task description


API Routes:

  Authentication routes
  POST /api/auth/login

  - Body: { email: string, password: string }
  - Response: { success: boolean }
  - Description: Authenticates user and creates session

  POST /api/auth/register

  - Body: { email: string, password: string }
  - Response: { success: boolean }
  - Description: Creates new user account

  GET /api/auth/current

  - Response: { data: User }
  - Description: Returns current authenticated user
  - Requires: Session middleware

  POST /api/auth/logout

  - Response: { success: boolean }
  - Description: Ends user session

  Workspace Routes
  GET /api/workspaces

  - Response: { data: { documents: Workspace[], total: number } }
  - Description: Lists all workspaces user is member of
  - Requires: Session middleware

  GET /api/workspaces/:workspaceId

  - Response: { data: Workspace }
  - Description: Get specific workspace details
  - Requires: Session middleware

  GET /api/workspaces/:workspaceId/info

  - Response: { data: { $id: string, name: string, imageUrl: string } }
  - Description: Get basic workspace information
  - Requires: Session middleware

  GET /api/workspaces/:workspaceId/analytics
  Request:
    Params: {
      workspaceId: string
    }
  Response:
    {
      data: {
        taskCount: number,            // Total tasks this month
        taskDifference: number,       // Change from last month
        assignedTaskCount: number,    // Tasks assigned to current user this month
        assignedTaskDifference: number,
        incompleteTaskCount: number,  // Tasks not marked as DONE this month
        incompleteTaskDifference: number,
        completedTaskCount: number,   // Tasks marked as DONE this month
        completedTaskDifference: number,
        overdueTaskCount: number,     // Tasks past due date this month
        overdueTaskDifference: number
      }
    }
  Description:
    Returns analytics data comparing current month's tasks with previous month
  Requirements:
    - Session middleware
    - Must be workspace member

  POST /api/workspaces

  - Body: FormData with { name: string, image?: File }
  - Response: { data: Workspace }
  - Description: Creates new workspace
  - Requires: Session middleware

  PATCH /api/workspaces/:workspaceId

  - Body: FormData with { name: string, image?: File }
  - Response: { data: Workspace }
  - Description: Updates workspace details
  - Requires: Session middleware, Admin role

  DELETE /api/workspaces/:workspaceId

  - Response: { data: { $id: string } }
  - Description: Deletes workspace
  - Requires: Session middleware, Admin role

  POST /api/workspaces/:workspaceId/reset-invite-code

  - Response: { data: Workspace }
  - Description: Generates new invite code
  - Requires: Session middleware, Admin role

  POST /api/workspaces/:workspaceId/join

  - Body: { code: string }
  - Response: { data: Member }
  - Description: Joins workspace using invite code
  - Requires: Session middleware

  Members routes

  GET /api/members
  - Query: { workspaceId: string }
  - Response: { data: { documents: Member[], total: number } }
  - Description: Lists all members in a workspace
  - Requires: Session middleware

  DELETE /api/members/:memberId
  - Response: { data: { $id: string } }
  - Description: Removes member from workspace
  - Requires: Session middleware, Admin role

  PATCH /api/members/:memberId
  Request:
    Params: {
      memberId: string
    }
    Body: {
      role: MemberRole // 'ADMIN' | 'MEMBER'
    }
  Response:
    {
      data: {
        $id: string
      }
    }
  Description:
    Updates a member's role in a workspace
  Requirements:
    - Session middleware
    - Must be workspace admin
    - Cannot downgrade the only member

  Project routes
  GET /api/projects
  - Query: { workspaceId: string }
  - Response: { data: { documents: Project[], total: number } }
  - Description: Lists all projects in a workspace
  - Requires: Session middleware

  GET /api/projects/:projectId
  - Response: { data: Project }
  - Description: Get specific project details
  - Requires: Session middleware

  GET /api/projects/:projectId/analytics
  Request:
    Params: {
      projectId: string
    }
  Response:
    {
      data: {
        taskCount: number,            // Total tasks this month
        taskDifference: number,       // Change from last month
        assignedTaskCount: number,    // Tasks assigned this month
        assignedTaskDifference: number,
        incompleteTaskCount: number,  // Tasks not DONE this month
        incompleteTaskDifference: number,
        completedTaskCount: number,   // Tasks marked as DONE this month
        completedTaskDifference: number,
        overdueTaskCount: number,     // Tasks past due date this month
        overdueTaskDifference: number
      }
    }
  Description:
    Returns analytics data comparing current month's project tasks with previous month
  Requirements:
    - Session middleware
    - Must be workspace member

  POST /api/projects
  - Body: { name: string, workspaceId: string }
  - Response: { data: Project }
  - Description: Creates new project
  - Requires: Session middleware

  DELETE /api/projects/:projectId
  - Response: { data: { $id: string } }
  - Description: Deletes project
  - Requires: Session middleware

  PATCH /api/projects/:projectId
  Request:
    Params: {
      projectId: string
    }
    Body: FormData {
      name: string,
      image?: File
    }
  Response:
    {
      data: Project
    }
  Description:
    Updates project details including name and image
  Requirements:
    - Session middleware
    - Must be workspace member
    - Image will be converted to base64 if provided

  Task routes
  GET /api/tasks
  - Query: { projectId: string }
  - Response: { data: { documents: Task[], total: number } }
  - Description: Lists all tasks in a project
  - Requires: Session middleware

  GET /api/tasks/:taskId
  Request:
    Params: {
      taskId: string
    }
  Response:
    {
      data: {
        ...Task,
        project: Project,    // Populated project details
        assignee: {         // Populated assignee details
          $id: string,
          name: string,
          email: string,
          userId: string,
          workspaceId: string,
          role: MemberRole
        }
      }
    }
  Description:
    Retrieves a specific task with populated project and assignee details
  Requirements:
    - Session middleware
    - Must be workspace member

  POST /api/tasks
  - Body: { title: string, projectId: string, status: TaskStatus }
  - Response: { data: Task }
  - Description: Creates new task
  - Requires: Session middleware

  PATCH /api/tasks/:taskId
  - Body: { title?: string, status?: TaskStatus }
  - Response: { data: Task }
  - Description: Updates task details
  - Requires: Session middleware

  DELETE /api/tasks/:taskId
  - Response: { data: { $id: string } }
  - Description: Deletes task
  - Requires: Session middleware

  POST /api/tasks/bulk-update
  - Body: { tasks: { id: string, status: TaskStatus }[] }
  - Response: { success: boolean }
  - Description: Updates multiple tasks at once
  - Requires: Session middleware



File Tree:
📦src
┣ 📂app
┃ ┣ 📂(auth)
┃ ┃ ┣ 📂sign-in
┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┣ 📂sign-up
┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┗ 📜layout.tsx
┃ ┣ 📂(dashboard)
┃ ┃ ┣ 📂workspaces
┃ ┃ ┃ ┗ 📂[workspaceId]
┃ ┃ ┃ ┃ ┣ 📂projects
┃ ┃ ┃ ┃ ┃ ┗ 📂[projectId]
┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜client.tsx
┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┃ ┃ ┣ 📂tasks
┃ ┃ ┃ ┃ ┃ ┣ 📂[taskId]
┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜client.tsx
┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┃ ┃ ┣ 📜client.tsx
┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┣ 📜layout.tsx
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📂(standalone)
┃ ┃ ┣ 📂workspaces
┃ ┃ ┃ ┣ 📂[workspaceId]
┃ ┃ ┃ ┃ ┣ 📂join
┃ ┃ ┃ ┃ ┃ ┗ 📂[inviteCode]
┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜client.tsx
┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┃ ┃ ┣ 📂members
┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┃ ┃ ┣ 📂projects
┃ ┃ ┃ ┃ ┃ ┗ 📂[projectId]
┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂settings
┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜client.tsx
┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┃ ┃ ┗ 📂settings
┃ ┃ ┃ ┃ ┃ ┣ 📜client.tsx
┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┃ ┗ 📂create
┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┗ 📜layout.tsx
┃ ┣ 📂api
┃ ┃ ┗ 📂[[...route]]
┃ ┃ ┃ ┗ 📜route.ts
┃ ┣ 📂fonts
┃ ┃ ┣ 📜GeistMonoVF.woff
┃ ┃ ┗ 📜GeistVF.woff
┃ ┣ 📂oauth
┃ ┃ ┗ 📜route.ts
┃ ┣ 📜error.tsx
┃ ┣ 📜favicon.ico
┃ ┣ 📜globals.css
┃ ┣ 📜layout.tsx
┃ ┗ 📜loading.tsx
┣ 📂components
┃ ┣ 📂ui
┃ ┃ ┣ 📜avatar.tsx
┃ ┃ ┣ 📜badge.tsx
┃ ┃ ┣ 📜button.tsx
┃ ┃ ┣ 📜calendar.tsx
┃ ┃ ┣ 📜card.tsx
┃ ┃ ┣ 📜chart.tsx
┃ ┃ ┣ 📜checkbox.tsx
┃ ┃ ┣ 📜dialog.tsx
┃ ┃ ┣ 📜drawer.tsx
┃ ┃ ┣ 📜dropdown-menu.tsx
┃ ┃ ┣ 📜form.tsx
┃ ┃ ┣ 📜input.tsx
┃ ┃ ┣ 📜label.tsx
┃ ┃ ┣ 📜popover.tsx
┃ ┃ ┣ 📜scroll-area.tsx
┃ ┃ ┣ 📜select.tsx
┃ ┃ ┣ 📜separator.tsx
┃ ┃ ┣ 📜sheet.tsx
┃ ┃ ┣ 📜skeleton.tsx
┃ ┃ ┣ 📜sonner.tsx
┃ ┃ ┣ 📜table.tsx
┃ ┃ ┣ 📜tabs.tsx
┃ ┃ ┗ 📜textarea.tsx
┃ ┣ 📜analytics-card.tsx
┃ ┣ 📜analytics.tsx
┃ ┣ 📜date-picker.tsx
┃ ┣ 📜dotted-separator.tsx
┃ ┣ 📜mobile-sidebar.tsx
┃ ┣ 📜navbar.tsx
┃ ┣ 📜navigation.tsx
┃ ┣ 📜page-error.tsx
┃ ┣ 📜page-loader.tsx
┃ ┣ 📜projects.tsx
┃ ┣ 📜query-provider.tsx
┃ ┣ 📜responsive-modal.tsx
┃ ┣ 📜sidebar.tsx
┃ ┗ 📜workspace-switcher.tsx
┣ 📂features
┃ ┣ 📂auth
┃ ┃ ┣ 📂api
┃ ┃ ┃ ┣ 📜use-current.ts
┃ ┃ ┃ ┣ 📜use-login.ts
┃ ┃ ┃ ┣ 📜use-logout.ts
┃ ┃ ┃ ┗ 📜use-register.ts
┃ ┃ ┣ 📂components
┃ ┃ ┃ ┣ 📜sign-in-card.tsx
┃ ┃ ┃ ┣ 📜sign-up-card.tsx
┃ ┃ ┃ ┗ 📜user-button.tsx
┃ ┃ ┣ 📂server
┃ ┃ ┃ ┗ 📜route.ts
┃ ┃ ┣ 📜constants.ts
┃ ┃ ┣ 📜queries.ts
┃ ┃ ┗ 📜schemas.ts
┃ ┣ 📂members
┃ ┃ ┣ 📂api
┃ ┃ ┃ ┣ 📜use-delete-member.ts
┃ ┃ ┃ ┣ 📜use-get-members.ts
┃ ┃ ┃ ┗ 📜use-update-member.ts
┃ ┃ ┣ 📂components
┃ ┃ ┃ ┗ 📜member-avatar.tsx
┃ ┃ ┣ 📂server
┃ ┃ ┃ ┗ 📜route.ts
┃ ┃ ┣ 📜types.ts
┃ ┃ ┗ 📜utils.ts
┃ ┣ 📂projects
┃ ┃ ┣ 📂api
┃ ┃ ┃ ┣ 📜use-create-project.ts
┃ ┃ ┃ ┣ 📜use-delete-project.ts
┃ ┃ ┃ ┣ 📜use-get-project-analytics.ts
┃ ┃ ┃ ┣ 📜use-get-project.ts
┃ ┃ ┃ ┣ 📜use-get-projects.ts
┃ ┃ ┃ ┗ 📜use-update-project.ts
┃ ┃ ┣ 📂components
┃ ┃ ┃ ┣ 📜create-project-form.tsx
┃ ┃ ┃ ┣ 📜create-project-modal.tsx
┃ ┃ ┃ ┣ 📜edit-project-form.tsx
┃ ┃ ┃ ┗ 📜project-avatar.tsx
┃ ┃ ┣ 📂hooks
┃ ┃ ┃ ┣ 📜use-create-project-modal.ts
┃ ┃ ┃ ┗ 📜use-project-id.ts
┃ ┃ ┣ 📂server
┃ ┃ ┃ ┗ 📜route.ts
┃ ┃ ┣ 📜schemas.ts
┃ ┃ ┗ 📜types.ts
┃ ┣ 📂tasks
┃ ┃ ┣ 📂api
┃ ┃ ┃ ┣ 📜use-bulk-update-tasks.ts
┃ ┃ ┃ ┣ 📜use-create-task.ts
┃ ┃ ┃ ┣ 📜use-delete-task.ts
┃ ┃ ┃ ┣ 📜use-get-task.ts
┃ ┃ ┃ ┣ 📜use-get-tasks.ts
┃ ┃ ┃ ┗ 📜use-update-task.ts
┃ ┃ ┣ 📂components
┃ ┃ ┃ ┣ 📜columns.tsx
┃ ┃ ┃ ┣ 📜create-task-form-wrapper.tsx
┃ ┃ ┃ ┣ 📜create-task-form.tsx
┃ ┃ ┃ ┣ 📜create-task-modal.tsx
┃ ┃ ┃ ┣ 📜data-calendar.css
┃ ┃ ┃ ┣ 📜data-calendar.tsx
┃ ┃ ┃ ┣ 📜data-filters.tsx
┃ ┃ ┃ ┣ 📜data-kanban.tsx
┃ ┃ ┃ ┣ 📜data-table.tsx
┃ ┃ ┃ ┣ 📜edit-task-form-wrapper.tsx
┃ ┃ ┃ ┣ 📜edit-task-form.tsx
┃ ┃ ┃ ┣ 📜edit-task-modal.tsx
┃ ┃ ┃ ┣ 📜event-card.tsx
┃ ┃ ┃ ┣ 📜kanban-card.tsx
┃ ┃ ┃ ┣ 📜kanban-column-header.tsx
┃ ┃ ┃ ┣ 📜overview-property.tsx
┃ ┃ ┃ ┣ 📜task-actions.tsx
┃ ┃ ┃ ┣ 📜task-breadcrumbs.tsx
┃ ┃ ┃ ┣ 📜task-date.tsx
┃ ┃ ┃ ┣ 📜task-description.tsx
┃ ┃ ┃ ┣ 📜task-overview.tsx
┃ ┃ ┃ ┗ 📜task-view-switcher.tsx
┃ ┃ ┣ 📂hooks
┃ ┃ ┃ ┣ 📜use-create-task-modal.tsx
┃ ┃ ┃ ┣ 📜use-edit-task-modal.tsx
┃ ┃ ┃ ┣ 📜use-task-filters.ts
┃ ┃ ┃ ┗ 📜use-task-id.ts
┃ ┃ ┣ 📂server
┃ ┃ ┃ ┗ 📜route.ts
┃ ┃ ┣ 📜schemas.ts
┃ ┃ ┗ 📜types.ts
┃ ┗ 📂workspaces
┃ ┃ ┣ 📂api
┃ ┃ ┃ ┣ 📜use-create-workspace.ts
┃ ┃ ┃ ┣ 📜use-delete-workspace.ts
┃ ┃ ┃ ┣ 📜use-get-workspace-analytics.ts
┃ ┃ ┃ ┣ 📜use-get-workspace-info.tsx
┃ ┃ ┃ ┣ 📜use-get-workspace.tsx
┃ ┃ ┃ ┣ 📜use-get-workspaces.ts
┃ ┃ ┃ ┣ 📜use-join-workspace.ts
┃ ┃ ┃ ┣ 📜use-reset-invite-code.ts
┃ ┃ ┃ ┗ 📜use-update-workspace.ts
┃ ┃ ┣ 📂components
┃ ┃ ┃ ┣ 📜create-workspace-form.tsx
┃ ┃ ┃ ┣ 📜create-workspace-modal.tsx
┃ ┃ ┃ ┣ 📜edit-workspace-form.tsx
┃ ┃ ┃ ┣ 📜join-workspace-form.tsx
┃ ┃ ┃ ┣ 📜members-list.tsx
┃ ┃ ┃ ┗ 📜workspace-avatar.tsx
┃ ┃ ┣ 📂hooks
┃ ┃ ┃ ┣ 📜use-create-workspace-modal.ts
┃ ┃ ┃ ┣ 📜use-invite-code.ts
┃ ┃ ┃ ┗ 📜use-workspace-id.ts
┃ ┃ ┣ 📂server
┃ ┃ ┃ ┗ 📜route.ts
┃ ┃ ┣ 📜queries.ts
┃ ┃ ┣ 📜schemas.ts
┃ ┃ ┗ 📜types.ts
┣ 📂hooks
┃ ┗ 📜use-confirm.tsx
┣ 📂lib
┃ ┣ 📜appwrite.ts
┃ ┣ 📜oauth.ts
┃ ┣ 📜rpc.ts
┃ ┣ 📜session-middleware.ts
┃ ┗ 📜utils.ts
┗ 📜config.ts
