namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class codFuent : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "MT.SoftwarePersonal", name: "Adjunto", newName: "CodigoFuente");
            RenameIndex(table: "MT.SoftwarePersonal", name: "IX_Adjunto", newName: "IX_CodigoFuente");
        }
        
        public override void Down()
        {
            RenameIndex(table: "MT.SoftwarePersonal", name: "IX_CodigoFuente", newName: "IX_Adjunto");
            RenameColumn(table: "MT.SoftwarePersonal", name: "CodigoFuente", newName: "Adjunto");
        }
    }
}
