namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class resolviendo : DbMigration
    {
        public override void Up()
        {
            //AlterColumn("GEN.Propuestas", "EstadoPropuesta", c => c.String(maxLength: 40));
        }
        
        public override void Down()
        {
            //AlterColumn("GEN.Propuestas", "EstadoPropuesta", c => c.String(maxLength: 20));
        }
    }
}
