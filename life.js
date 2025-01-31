// Get widget properties
const widgetFamily = config.widgetFamily || 'medium'

// Configuration
const widgetConfig = {
    backgroundColor: new Color('#242424'),
    textColor: new Color('#FFFFFF')
}

// Calculate days elapsed
function getDaysElapsed(birthDate) {
    const birth = new Date(birthDate);
    const now = new Date();
    const diff = now - birth;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDaysInLife(birthDate, deathDate) {
    // Convert dates to milliseconds since Unix Epoch
    const birthTime = new Date(birthDate).getTime()
    const deathTime = new Date(deathDate).getTime()

    // Calculate difference in milliseconds
    const differenceInMs = deathTime - birthTime

    // Convert milliseconds to days
    const differenceInDays = Math.floor(differenceInMs / 86400000)

    return differenceInDays
}

// Calculate total days in year
function getDaysInYear() {
    const year = new Date().getFullYear()
    return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365
}

// Create and present widget
async function createWidget() {
    const widget = new ListWidget()
    widget.backgroundColor = widgetConfig.backgroundColor

    const daysElapsed = getDaysElapsed('add bday')
    const totalDays = getDaysInLife('add bday', 'bday + 84 years')
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
        const titleText = textStack.addText('Life')
        titleText.font = Font.boldSystemFont(16)
        titleText.textColor = widgetConfig.textColor

        // Add flexible space between texts
        textStack.addSpacer()

        // Add percentage
        const percentageText = textStack.addText(`${percentage}%`)
        percentageText.font = Font.boldSystemFont(16)
        percentageText.textColor = widgetConfig.textColor

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
