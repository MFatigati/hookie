import { Callback, Document, MongoClient, OptionalId, WithId } from 'mongodb';

let uri:string = process.env.MONGO_URI as string;
//console.log("Mongo URI: ", uri)
const appDB: string = "req_bin_app"

export async function addReqDoc(newReqDoc: OptionalId<Document>, binName: string) {
    const client: MongoClient = new MongoClient(uri);
    try {
        await client.connect();
        // modifiable code start
        let result = await client.db(appDB).collection(binName).insertOne(newReqDoc);
        console.log(result);
        // end modifiable code
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

export async function listAllBins() {
    const client: MongoClient = new MongoClient(uri);
    let result: any[] = [];
    try {
        await client.connect();
        // modifiable code start
        result = await client.db(appDB).listCollections().toArray();
        // end modifiable code
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
        result = result.map(record => record.name)
        return result
    }
}

export async function getAllReqDocs_FromOneBin(binName: string) {
    const client: MongoClient = new MongoClient(uri);
    let result: any[] = [];
    try {
        await client.connect();
        // modifiable code start
        result = await client.db(appDB).collection(binName).find().toArray();
        //console.log(result)
        // end modifiable code
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
        return result
    }
}

export async function findSingleReqDoc_FromOneBin(bin: string, searchParams: Callback<WithId<Document> | null>) {
    const client: MongoClient = new MongoClient(uri);
    try {
        await client.connect();
        // modifiable code start
        let result = await client.db(appDB).collection(bin).findOne(searchParams);
        console.log(result);
        // end modifiable code
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

export async function deleteAllReqDocs_FromOneBin(bin: string) {
    const client: MongoClient = new MongoClient(uri);
    try {
        await client.connect();
        // modifiable code start
        let result = await client.db(appDB).collection(bin).deleteMany({});
        console.log(result);
        // end modifiable code
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}