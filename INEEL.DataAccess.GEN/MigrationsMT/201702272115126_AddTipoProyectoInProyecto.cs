namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTipoProyectoInProyecto : DbMigration
    {
        public override void Up()
        {
            //AddColumn("GEN.Proyectos", "TipoProyecto", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            //DropColumn("GEN.Proyectos", "TipoProyecto");
        }
    }
}
