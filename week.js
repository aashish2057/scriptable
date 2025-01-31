// Get widget properties
const widgetFamily = config.widgetFamily || 'medium'

// Configuration
const widgetConfig = {
    backgroundColor: new Color('#242424'),
    textColor: new Color('#FFFFFF')
}

// Calculate days elapsed in the current week
function getDaysElapsed() {
    const now = new Date()
    const startOfWeek = new Date(now) // Clone the current date
    startOfWeek.setDate(now.getDate() - now.getDay()) // Set to the start of the week (Sunday)
    const diff = now - startOfWeek - 1
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1 // Add 1 because it's inclusive
}

// Create and present widget
async function createWidget() {
    const widget = new ListWidget()
    widget.backgroundColor = widgetConfig.backgroundColor

    const daysElapsed = getDaysElapsed()
    const totalDays = 7
    const percentage = ((daysElapsed / totalDays) * 100).toFixed(1)

    if (widgetFamily === 'small') {
        // Small widget layout
        const stack = widget.addStack()
        stack.layoutVertically()
        stack.centerAlignContent()

        const dayText = stack.addText(`Day ${daysElapsed}`)
        dayText.font = Font.boldSystemFont(32)
        dayText.textColor = widgetConfig.textColor

        const percentText = stack.addText(`${percentage}%`)
        percentText.font = Font.systemFont(16)
        percentText.textColor = widgetConfig.textColor

    } else {
        // Medium/Large widget layout
        const stack = widget.addStack()
        stack.layoutVertically()
        stack.centerAlignContent()

        // Create horizontal stack for text
        const textStack = stack.addStack()
        textStack.layoutHorizontally()
        textStack.centerAlignContent()

        // Add spacer for left margin
        textStack.addSpacer()

        // Add title text
        const titleText = textStack.addText('Week')
        titleText.font = Font.boldSystemFont(16)
        titleText.textColor = widgetConfig.textColor

        // Add flexible space between texts
        textStack.addSpacer()

        // Add day count
        const dayText = textStack.addText(`${percentage}%`)
        dayText.font = Font.boldSystemFont(16)
        dayText.textColor = widgetConfig.textColor

        // Add spacer for right margin
        textStack.addSpacer()

        stack.addSpacer(8)

        // Create horizontal stack for centering
        const barContainer = stack.addStack()
        barContainer.layoutHorizontally()

        // Add spacer for left margin
        barContainer.addSpacer()

        // Add progress bar
        const progressBar = barContainer.addStack()
        progressBar.size = new Size(200, 5)
        progressBar.cornerRadius = 3
        progressBar.backgroundColor = new Color('#333333')
        progressBar.layoutHorizontally() // Ensure horizontal layout

        // Create progress indicator starting from left
        const progress = progressBar.addStack()
        progress.size = new Size(200 * (daysElapsed / totalDays), 5)
        progress.backgroundColor = new Color('#FFFFFF')
        progress.layoutHorizontally() // Ensure horizontal layout

        // Fill remaining space to maintain centering
        progressBar.addSpacer()

        // Add spacer for right margin
        barContainer.addSpacer()
    }

    // Refresh widget daily at midnight
    const tomorrow = new Date()
    tomorrow.setHours(24, 0, 0, 0)
    widget.refreshAfterDate = tomorrow

    return widget
}

// Run widget
if (config.runsInWidget) {
    const widget = await createWidget()
    Script.setWidget(widget)
} else {
    const widget = await createWidget()
    await widget.presentMedium()
}
Script.complete()
