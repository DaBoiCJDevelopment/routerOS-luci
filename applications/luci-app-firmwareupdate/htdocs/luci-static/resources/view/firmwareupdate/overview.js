'use strict';
'require fs';
'require rpc';
'require view';

var boardInfo = rpc.declare({
    object: 'system',
    method: 'board',
    expect: { 'board_name': '' }
});

const MANIFEST_URL = "http://192.168.8.216:8404/manifest.json";

function doUpdate(imageUrl) {
    if (!confirm(_('This will reboot the router. Continue?')))
        return;

    fs.exec('/usr/libexec/firmwareupdate/update.sh ' +
            MANIFEST_URL + ' ' +
            imageUrl);
}

return view.extend({
    load: function () {
        return boardInfo();
    },

    render: function (board) {
        var div = E('div');

        fetch(MANIFEST_URL)
            .then(resp => resp.json())
            .then(manifest => {
                var boardName = board.board_name;
                var [subtarget, target] = board.release.target.split('/');

                var entry = manifest.boards &&
                            manifest.boards[boardName] &&
                            manifest.boards[boardName][subtarget] &&
                            manifest.boards[boardName][subtarget][target];

                if (!entry) {
                    div.appendChild(E('p', {}, _('No firmware available for this device.')));
                    return;
                }

                var table = E('table', { 'class': 'cbi-section-table' },
                    E('tr', {},
                      E('th', {}, _('Version')),
                      E('th', {}, _('Description')),
                      E('th', {}, _('Action')))
                );

                Object.keys(entry.versions).sort().forEach(v => {
                    var info = entry.versions[v];
                    table.appendChild(
                        E('tr', {},
                          E('td', {}, v),
                          E('td', {}, info.description),
                          E('td', {},
                            E('button', {
                              'class': 'cbi-button cbi-button-action',
                              'click': () => doUpdate(info.image.url)
                            }, _('Update')))
                        )
                    );
                });

                div.appendChild(table);
            })
            .catch(() => {
                div.appendChild(E('p', {}, _('Failed to load manifest.')));
            });

        return div;
    }
});
