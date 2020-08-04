
package gen.sim.geneticssim.service;

import gen.sim.geneticssim.data.TraitDao;
import gen.sim.geneticssim.service.utility.AllTraits;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TraitService {

    @Autowired
    private TraitDao tDao;
    
    public TraitService() {
    }
    
    public void populateAllTraits() {
        AllTraits.setAllTraits(tDao.getAllTraits());
    }
}
