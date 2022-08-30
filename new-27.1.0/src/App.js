import React from 'react'
import { LicenseManager } from "ag-grid-enterprise";
import { AgGridReact } from 'ag-grid-react'
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { cols } from './cols'
import Axios from 'axios'


/* LicenseManager.setLicenseKey(
    "LICENSE_STRING_GOES_HERE"
)
 */

export const App = () => {

    const [postData, setPostData] = React.useState({
        query: ''
    })
    const [gridApi, setGridApi] = React.useState(null)
    const count = React.useRef(0)
    const paramsRef = React.useRef(null)

    const dataSource = {
        rowCount: 1,
        getRows: (params) => {
            paramsRef.current = params
            if (count.current == 0) {
                const filterText = localStorage.getItem('filterText')
                const filterComponent = paramsRef.current.api.getFilterInstance("employee");
                filterComponent.setModel({
                    type: "startsWith",
                    filter: filterText
                });
                paramsRef.current.api.onFilterChanged()
                count.current = 1;
                return
            } else {
                if (count.current == 1) {
                    const filterValue = params.request.filterModel?.employee?.filter
                    setPostData({
                        ...postData,
                        query: filterValue ? filterValue : ''
                    })
                }
            }
        }
    }

    React.useEffect(() => {
        if (paramsRef.current) {

            const { query: filter } = postData
            let apiURL = `http://localhost:8080/getEmployees`
            if (filter) {
                apiURL = `http://localhost:8080/getEmployees?query=${filter}`
            }

            Axios.get(apiURL).then((records) => {
                paramsRef.current.successCallback(records.data, records.data.length)
                if (records.data.length != 0) {
                    paramsRef.current.api.hideOverlay()
                } else {
                    paramsRef.current.api.showNoRowsOverlay()
                }
            })

            if (count.current == 1) {
                const { query: filterText } = postData
                localStorage.setItem('filterText', filterText)
            }
        }
    }, [postData])

    React.useEffect(() => {
        if (gridApi) {
            gridApi.setServerSideDatasource(dataSource)
        }
    }, [gridApi])

    const styles = {
        height: '400px',
        width: '830px'
    }

    const handleGridReady = (params) => {
        setGridApi(params.api)
    }



    return (<div
        className="ag-theme-balham"
        style={styles}
    >
        <AgGridReact
            columnDefs={cols}
            floatingFilter={true}
            rowModelType={'serverSide'}
            cacheBlockSize={25}
            pagination={true}
            paginationPageSize={25}
            serverSideStoreType={'partial'}
            onGridReady={handleGridReady}
        />
    </div>)
}