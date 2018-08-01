namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificacionCampoDescripcionCompetencias : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_Competencias", "Descripcion", c => c.String(maxLength: 600));
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_Competencias", "Descripcion", c => c.String(maxLength: 200));
        }
    }
}
