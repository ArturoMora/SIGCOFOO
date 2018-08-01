namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ajusteSoftware2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.SoftwarePersonal", "ManualUsuario", c => c.Long(nullable: false));
            CreateIndex("MT.SoftwarePersonal", "ManualUsuario");
            AddForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto", "AdjuntoId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto");
            DropIndex("MT.SoftwarePersonal", new[] { "ManualUsuario" });
            DropColumn("MT.SoftwarePersonal", "ManualUsuario");
        }
    }
}
