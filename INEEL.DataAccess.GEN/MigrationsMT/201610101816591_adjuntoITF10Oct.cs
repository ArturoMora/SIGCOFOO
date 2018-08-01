namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class adjuntoITF10Oct : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.AdjuntoITF", "Procesado", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("MT.AdjuntoITF", "Procesado");
        }
    }
}
