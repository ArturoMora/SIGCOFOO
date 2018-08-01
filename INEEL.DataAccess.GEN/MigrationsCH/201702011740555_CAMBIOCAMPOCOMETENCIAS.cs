namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CAMBIOCAMPOCOMETENCIAS : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_NominaCompetencias", "nombreCategoriaServicio", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CH.cat_NominaCompetencias", "nombreCategoriaServicio");
        }
    }
}
