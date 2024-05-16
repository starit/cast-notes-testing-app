/* eslint-disable react/jsx-no-useless-fragment */
import { clsx } from 'clsx';
import { decodeAbiParameters } from 'viem'
import { HistoryRecord } from '../page'

type Props = {
  // any props that come into the component
  historyRows: HistoryRecord[]
}

export default function AttestationHistory({ historyRows }: Props) {
  console.log('historyRows', historyRows)

  if (historyRows.length === 0) {
    return <></>
  }
  const rows: any[] = []


  const parseOnchaindata = (row) => {
    return decodeAbiParameters(row.schema.data, row.data as `0x${string}`) as object
  }
    
  const tdClass = clsx([
    'border border-slate-300',
    'p-2  text-sm'
  ])

  if (historyRows.length !== 0) {
    for (const row of historyRows) {
      console.log('row', row, typeof row)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const data = parseOnchaindata(row)
      console.log('parsed data', data)
      
      rows.push((<tr>
        <td className={tdClass}>
          <a href={`${process.env.NEXT_PUBLIC_SIGN_SCAN_URL}/attestation/${row.id}`} target="_blank" >
            <code className="text-sm">{row.id}</code>
          </a>
        </td>
        <td className={tdClass}>{new Date(row.attestTimestamp as unknown as number * 1).toUTCString()}</td>
        {/* <td className={tdClass}>{row.schemaId}</td> */}
        {/* <td className={tdClass}>{row.attester}</td> */}
        {/* <td className={tdClass}>{data.attesterFID}</td> */}

        {/* context */}
        <td className={tdClass}>{data[5]}</td>
        {/* castHash */}
        <td className={tdClass}>
          <code className="text-sm">{data[1]}</code>
        </td>
        {/* castAuthorFID */}
        <td className={tdClass}>{(data[2] as bigint).toString(10)}</td>
        <td className={tdClass}><a href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/frame/${row.id}/0`}>Frame Link</a></td>
      </tr>))
    }
  }
  return (
    <div
      className={clsx([
        'grid grid-cols-1 items-stretch justify-start',
        'gap-9 grid-cols-1',
        // 'md:grid-cols-2CoffeeMd md:gap-9 lg:grid-cols-2CoffeeMd',
      ])}
    >
      <section
        className={clsx([
          'rounded-lg border border-solid border-boat-color-palette-line',
          'bg-boat-color-palette-backgroundalternate p-10',
        ])}
      >
        <h2 className="mb-5 w-fit text-2xl font-semibold text-white">My Attestation History</h2>
        
        <div className="gap-16">
          <table id='attestation-history' className="table-auto border-collaps text-base">
            <thead>
              <tr>
                <th className={tdClass}>Attestation ID</th>
                <th className={tdClass}>Attest Time</th>
                {/* <th>SchemaId</th> */}
                {/* <th>Attester</th> */}
                {/* <th className={tdClass}>Attester FID</th> */}
                <th className={tdClass}>Attester Comment</th>
                <th className={tdClass}>Cast Hash</th>
                <th className={tdClass}>Cast Author</th>
                <th className={tdClass}>Frame Link</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
