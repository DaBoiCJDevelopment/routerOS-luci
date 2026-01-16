module("luci.controller.firmwareupdate", package.seeall)

function index()
    entry({"admin", "system", "firmwareupdate"},
        firstchild(), "Firmware Updater", 90).dependent = false

    entry({"admin", "system", "firmwareupdate", "overview"},
        view("firmwareupdate/overview"), "Overview", 1)
end
