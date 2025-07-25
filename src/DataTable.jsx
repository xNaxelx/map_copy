import {useEffect, useState} from "react";
import {formatDate} from "./util.js";

function DataTable({country, cases, selectedCase, onSelectCase}) {

    const [sortBy, setSortBy] = useState('caseId');
    const [sortDirection, setSortDirection] = useState(1);

    const filterData = (courtCase) => (courtCase.country || '?') === country;

    const sortData = (a, b) => {
        let aa = a[sortBy];
        let bb = b[sortBy];
        if (sortBy === 'borderSign' || sortBy === 'fine') {
            aa = aa ? aa.padStart('7') : 'ZZZZZZZ'; // Put unknown to the end
            bb = bb ? bb.padStart('7') : 'ZZZZZZZ';
        }
        return (aa === null) - (bb === null) || +(aa > bb) * sortDirection || -(aa < bb) * sortDirection;
    };

    const scrollToCase = (courtCase) => {
        if (courtCase) {
            const tr = document.getElementById('tr-' + courtCase.caseId);
            if (tr) {
                const rect = tr.getBoundingClientRect();
                const isOutsideViewport = rect.top < 0 || rect.bottom > (window.innerHeight || document.documentElement.clientHeight);
                if (isOutsideViewport) {
                    tr.scrollIntoView({block: 'center'});
                }
            }
        }
    }

    const toggleSort = (by) => {
        if (sortBy === by) {
            setSortDirection(-sortDirection);
        } else {
            setSortBy(by);
        }
    };

    useEffect(() => {
        scrollToCase(selectedCase);
    }, [sortBy, sortDirection, selectedCase]);

    return (
        <table>
            <thead>
            <tr>
                <th title="Номер прикордонного знаку" onClick={() => toggleSort('borderSign')}>Знак</th>
                <th title="Дата та час затримання" onClick={() => toggleSort('arrestDate')}>Дата</th>
                <th title="Відстань до кордону" onClick={() => toggleSort('distance')}>Відстань</th>
                <th title="Призначений штраф" onClick={() => toggleSort('fine')}>Штраф</th>
                <th>&nbsp;</th>
            </tr>
            </thead>
            <tbody>
            {cases.filter(filterData).sort(sortData).map((courtCase) => (
                <tr key={courtCase.caseId} id={'tr-' + courtCase.caseId}
                    className={courtCase === selectedCase ? 'selected' : ''}
                    onClick={() => onSelectCase(courtCase)}>
                    <td>{courtCase.borderSign}</td>
                    <td>{formatDate(courtCase.arrestDate)}</td>
                    <td>{courtCase.distance === null ? '?' : courtCase.distance}</td>
                    <td>{courtCase.fine === null ? '?' : courtCase.fine}</td>
                    <td><a href={'https://reyestr.court.gov.ua/Review/' + courtCase.caseId} title="Судове рішення">§</a>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default DataTable;