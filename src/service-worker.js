importScripts('./ngsw-worker.js')

self.addEventListener('sync', (event) => {
    if (event.tag === 'post-data') {
        //
        event.waitUntil(addData())
    }
})

function addData() {
    let obj = {
        name: "ooomnia"
    }
    fetch('http://localhost:55000/data', {
        method: 'POST',
        headers: { 'Content-Type': 'applocation/json' },
        body: JSON.stringify(obj)
    }).then(() => { Promise.resolve() }).catch(() => Promise.reject())
}