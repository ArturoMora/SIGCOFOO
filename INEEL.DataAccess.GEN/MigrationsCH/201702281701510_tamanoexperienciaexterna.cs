namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tamanoexperienciaexterna : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_ExperienciaExterna", "NombreEmpresa", c => c.String(maxLength: 100));
            AlterColumn("CH.tab_ExperienciaExterna", "Giro", c => c.String(maxLength: 100));
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_ExperienciaExterna", "Giro", c => c.String(maxLength: 50));
            AlterColumn("CH.tab_ExperienciaExterna", "NombreEmpresa", c => c.String(maxLength: 50));
        }
    }
}
