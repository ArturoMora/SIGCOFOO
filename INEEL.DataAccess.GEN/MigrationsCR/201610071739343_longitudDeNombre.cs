namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class longitudDeNombre : DbMigration
    {
        public override void Up()
        {
            //AlterColumn("GEN.Proyectos", "Nombre", c => c.String());
        }
        
        public override void Down()
        {
            //AlterColumn("GEN.Proyectos", "Nombre", c => c.String(maxLength: 200));
        }
    }
}