import multiparty from 'multiparty';

export default async function handle(req, res) {
    const form = multiparty.Form();
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });

        });
    });
    console.log('length:', files.length);
    console.log(fields);
    return res.json('ok');
}

export const Config = {
    api: { bodyParser: false },
};
